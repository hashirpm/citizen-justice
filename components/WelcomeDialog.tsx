'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText } from 'lucide-react';

export default function WelcomeDialog() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setIsOpen(true);
            localStorage.setItem('hasSeenWelcome', 'true');
        }
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="relative w-24 h-24 mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <FileText className="w-full h-full text-blue-500" />
                        </motion.div>
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: 0 }}
                            className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent"
                        />
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 2, duration: 0.5 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </motion.div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Welcome to Citizen Justice!</h2>
                    <p className="text-gray-600">Securing truth, one click at a time.</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}