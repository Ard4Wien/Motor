import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/store';

const ErrorToast = () => {
    const { errors, clearErrors } = useStore();

    if (errors.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="error-toast"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={clearErrors}
                style={{ cursor: 'pointer' }}
            >
                {errors.map((error, index) => (
                    <span key={index}>{error.message}</span>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default ErrorToast;
