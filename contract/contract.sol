// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CitizenJusticePlatform
 * @dev Main contract for managing evidence submission with multiple categories
 */
contract CitizenJusticePlatform {
    // Structs
    struct User {
        bool isVerified;
        uint256 reputationPoints;
        uint256 totalSubmissions;
        uint256 acceptedSubmissions;
        string identityHash;    // Hash of verified identity documents
    }
    
    struct SubmitterInfo {
        address userAddress;
        string identityHash;
        // uint256 reputationAtSubmission;
        // uint256 totalSubmissionsAtTime;
        // uint256 acceptedSubmissionsAtTime;
    }
    
    struct Evidence {
        SubmitterInfo submitterInfo;  // Detailed submitter information
        uint256 timestamp;
        string evidenceHash;    // IPFS hash of the evidence
        string geoLocation;
        uint256[] categoryIds;  // Multiple categories per evidence
        uint256 eventId;
        string metadata;        // Additional evidence metadata (JSON string)
        bool isDisputed;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasValidated;
        // mapping(uint256 => ValidationStatus) categoryValidations; // Validation status per category
    }
    
    // struct ValidationStatus {
    //     uint256 votesFor;
    //     uint256 votesAgainst;
    //     mapping(address => bool) hasValidated;
    // }
    
    struct Category {
        string name;
        string description;
        address[] validators;
        bool isActive;
        uint256 totalEvidence;
    }
    
    struct Event {
        string description;
        uint256 timestamp;
        string location;
        bool isActive;
        address creator;
        uint256[] categoryIds;  // Multiple categories per event
    }

    // State variables
    mapping(address => User) public users;
    mapping(uint256 => Evidence) public evidenceRegistry;
    mapping(uint256 => Category) public categories;
    mapping(uint256 => Event) public events;
    
    uint256 public evidenceCount;
    uint256 public categoryCount;
    uint256 public eventCount;
    
    // Constants
    uint256 public constant MINIMUM_REPUTATION = 0;
    uint256 public constant SUBMISSION_REWARD = 10;
    uint256 public constant VALIDATION_REWARD = 5;
    uint256 public constant FALSE_EVIDENCE_PENALTY = 50;
    
    // Events
    event UserVerified(address indexed user, string identityHash);
    event EvidenceSubmitted(uint256 indexed evidenceId,uint256 eventId, address indexed submitter,string evidenceHash,string geoLocation,string metadata);
    event CategoryAdded(uint256 indexed eventId, uint256 indexed categoryId);
    event EvidenceValidated(uint256 indexed evidenceId, uint256 indexed categoryId, bool isValid, address validator);
    event CategoryCreated(uint256 indexed categoryId, string name,string description);
    event EventCreated(uint256 indexed eventId, string description,string location,address creator,uint256[] categoryIds);
    event EventDeactivated(uint256 indexed eventId);
    event ReputationRewarded(address user,uint256 points);
    event ReputationPenalty(address user,uint256 points);

    // Modifiers
    modifier onlyVerifiedUser() {
        require(users[msg.sender].isVerified, "User not verified");
        _;
    }
    
    // modifier onlyCategoryValidator(uint256 _categoryId) {
    //     require(categories[_categoryId].isValidator[msg.sender], "Not category validator");
    //     _;
    // }
    
    modifier validCategories(uint256[] memory _categoryIds) {
        for (uint256 i = 0; i < _categoryIds.length; i++) {
            require(_categoryIds[i] < categoryCount, "Invalid category ID");
            require(categories[_categoryIds[i]].isActive, "Category not active");
        }
        _;
    }

    // User Management Functions
    function createUser(string memory _identityHash) external {
        require(!users[msg.sender].isVerified, "User already verified");
        
        users[msg.sender] = User({
            isVerified: false,
            reputationPoints: MINIMUM_REPUTATION,
            totalSubmissions: 0,
            acceptedSubmissions: 0,
            identityHash: _identityHash
        });
        
        emit UserVerified(msg.sender,_identityHash);
    }
    function verifyUser(string memory _identityHash) external {
        require(!users[msg.sender].isVerified, "User already verified");
        
        users[msg.sender].
            isVerified= true;
            
        emit UserVerified(msg.sender,_identityHash);
    }

    // Category Management Functions
    function createCategory(
        string memory _name,
        string memory _description
    ) external {
        // require(_minimumValidations > 0, "Invalid minimum validations");
        
        uint256 newCategoryId = categoryCount++;
        Category storage newCategory = categories[newCategoryId];
        
        newCategory.name = _name;
        newCategory.description = _description;
        newCategory.isActive = true;
        newCategory.validators.push(msg.sender);
        
        emit CategoryCreated(newCategoryId, _name,_description);
    }

    // Evidence Submission Functions
    function submitEvidence(
        string memory _evidenceHash,
        string memory _geoLocation,
        uint256[] memory _categoryIds,
        uint256 _eventId,
        string memory _metadata
    ) external onlyVerifiedUser validCategories(_categoryIds) {
        require(_categoryIds.length > 0, "At least one category required");
        
        if (_eventId != 0) {
            require(_eventId < eventCount, "Invalid event ID");
            require(events[_eventId].isActive, "Event not active");
        }
        
       
        Evidence storage newEvidence = evidenceRegistry[evidenceCount];
        
        // Create SubmitterInfo with current user data
        User storage submitter = users[msg.sender];
        newEvidence.submitterInfo = SubmitterInfo({
            userAddress: msg.sender,
            identityHash: submitter.identityHash
            // reputationAtSubmission: submitter.reputationPoints,
            // totalSubmissionsAtTime: submitter.totalSubmissions,
            // acceptedSubmissionsAtTime: submitter.acceptedSubmissions
        });
        
        newEvidence.timestamp = block.timestamp;
        newEvidence.evidenceHash = _evidenceHash;
        newEvidence.geoLocation = _geoLocation;
        newEvidence.categoryIds = _categoryIds;
        newEvidence.eventId = _eventId;
        newEvidence.metadata = _metadata;
        newEvidence.isDisputed = false;
        
        // Initialize validation status for each category
        for (uint256 i = 0; i < _categoryIds.length; i++) {
            categories[_categoryIds[i]].totalEvidence++;
        }
        
        users[msg.sender].totalSubmissions++;
           evidenceCount++;
        emit EvidenceSubmitted(evidenceCount,_eventId, msg.sender,_evidenceHash,_geoLocation,_metadata);
        for (uint256 i = 0; i < _categoryIds.length; i++) {
            emit CategoryAdded(_eventId, _categoryIds[i]);
        }
    }
    function createEvent(
        string memory _description,
        string memory _location,
        uint256[] memory _categoryIds
    ) external onlyVerifiedUser validCategories(_categoryIds) {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_categoryIds.length > 0, "At least one category required");
        
       
        Event storage newEvent = events[eventCount];
        
        newEvent.description = _description;
        newEvent.timestamp = block.timestamp;
        newEvent.location = _location;
        newEvent.isActive = true;
        newEvent.creator = msg.sender;
        newEvent.categoryIds = _categoryIds;
         eventCount++;
        emit EventCreated(eventCount, _description,_location,msg.sender,_categoryIds);
    }
    
    // Function to deactivate an event
    // function deactivateEvent(uint256 _eventId) external {
    //     require(_eventId > 0 && _eventId <= eventCount, "Invalid event ID");
    //     require(events[_eventId].creator == msg.sender, "Only creator can deactivate");
    //     require(events[_eventId].isActive, "Event already inactive");
        
    //     events[_eventId].isActive = false;
    //     emit EventDeactivated(_eventId);
    // }

    // Validation Functions
    function validateEvidence(
        uint256 _evidenceId,
        uint256 _categoryId,
        bool _isValid
    ) external {
        Evidence storage evidence = evidenceRegistry[_evidenceId];
        // ValidationStatus storage validation = evidence.categoryValidations[_categoryId];
        
        require(!evidence.hasValidated[msg.sender], "Already validated");
        
        // Verify category is associated with this evidence
        bool categoryFound = false;
        for (uint256 i = 0; i < evidence.categoryIds.length; i++) {
            if (evidence.categoryIds[i] == _categoryId) {
                categoryFound = true;
                break;
            }
        }
        require(categoryFound, "Category not associated with evidence");
        
        evidence.hasValidated[msg.sender] = true;
        
        if (_isValid) {
            evidence.votesFor++;
        } else {
            evidence.votesAgainst++;
        }
        
      
      
            
            address submitterAddress = evidence.submitterInfo.userAddress;
            
            // If majority validates it as true
            if (evidence.votesFor > evidence.votesAgainst) {
                users[submitterAddress].reputationPoints += SUBMISSION_REWARD;
                users[submitterAddress].acceptedSubmissions++;
                emit ReputationRewarded(submitterAddress,SUBMISSION_REWARD);
            } else {
                // Penalty for false evidence
                if (users[submitterAddress].reputationPoints >= FALSE_EVIDENCE_PENALTY) {
                    users[submitterAddress].reputationPoints -= FALSE_EVIDENCE_PENALTY;
                    emit ReputationPenalty(submitterAddress,FALSE_EVIDENCE_PENALTY);
                } else {
                    users[submitterAddress].reputationPoints = 0;
                }
            }
        
        
        // Reward validator
        users[msg.sender].reputationPoints += VALIDATION_REWARD;
        
        emit EvidenceValidated(_evidenceId, _categoryId, _isValid, msg.sender);
    }

}