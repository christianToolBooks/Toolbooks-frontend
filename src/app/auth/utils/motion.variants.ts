export const slideVariants = {
  enterFromLeft: {
    x: -1000,
    opacity: 0,
  },
  enterFromRight: {
    x: 1000,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exitToLeft: {
    x: -1000,
    opacity: 0,
  },
  exitToRight: {
    x: 1000,
    opacity: 0,
  },
};

export const transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  duration: 0.6,
};
