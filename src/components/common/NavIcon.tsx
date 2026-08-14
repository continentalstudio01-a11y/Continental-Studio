import React from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Phone,
  Info,
  Star,
  Package,
  Zap,
  Heart,
  Globe,
  Flame,
  Gift,
  ShoppingBag,
  User,
  Check,
  ExternalLink,
  Instagram,
  MessageCircle
} from 'lucide-react';

export const ICON_OPTIONS = [
  { id: 'Camera', label: 'Câmera', icon: Camera },
  { id: 'Package', label: 'Pacote / Caixa', icon: Package },
  { id: 'Sparkles', label: 'Brilho / IA', icon: Sparkles },
  { id: 'MessageCircle', label: 'WhatsApp', icon: MessageCircle },
  { id: 'MessageSquare', label: 'Chat / Mensagem', icon: MessageSquare },
  { id: 'Star', label: 'Estrela / Avaliação', icon: Star },
  { id: 'Info', label: 'Informação', icon: Info },
  { id: 'HelpCircle', label: 'Dúvidas / FAQ', icon: HelpCircle },
  { id: 'Phone', label: 'Telefone', icon: Phone },
  { id: 'Image', label: 'Galeria / Foto', icon: ImageIcon },
  { id: 'Zap', label: 'Raio / Velocidade', icon: Zap },
  { id: 'Flame', label: 'Fogo / Em Alta', icon: Flame },
  { id: 'Gift', label: 'Presente / Oferta', icon: Gift },
  { id: 'Heart', label: 'Coração', icon: Heart },
  { id: 'Globe', label: 'Globo / Site', icon: Globe },
  { id: 'ShoppingBag', label: 'Sacola / Loja', icon: ShoppingBag },
  { id: 'User', label: 'Perfil / Usuário', icon: User },
  { id: 'Check', label: 'Check / Garantia', icon: Check },
  { id: 'ExternalLink', label: 'Link Externo', icon: ExternalLink },
  { id: 'Instagram', label: 'Instagram', icon: Instagram }
];

interface NavIconProps {
  iconName?: string;
  iconUrl?: string;
  className?: string;
  animated?: boolean;
  animateOnHoverOnly?: boolean;
}

export const NavIcon: React.FC<NavIconProps> = ({
  iconName,
  iconUrl,
  className = 'w-5 h-5',
  animated = true,
  animateOnHoverOnly = false
}) => {
  // If custom uploaded image
  if (iconUrl) {
    return (
      <motion.div
        className="relative inline-flex items-center justify-center shrink-0"
        whileHover={{ scale: 1.15, rotate: 3 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <motion.img
          src={iconUrl}
          alt="Ícone Customizado"
          className={`${className} object-contain rounded-md shrink-0 relative z-10`}
          animate={
            animated && !animateOnHoverOnly
              ? { y: [0, -2, 0], filter: ['brightness(1)', 'brightness(1.15)', 'brightness(1)'] }
              : {}
          }
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-md bg-amber-400/20 blur-xs -z-0"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
    );
  }

  const name = iconName || 'Sparkles';

  // Get motion keyframes tailored for each icon type
  const getMotionAnimation = () => {
    if (!animated || animateOnHoverOnly) return {};

    switch (name) {
      case 'Sparkles':
        return {
          animate: {
            rotate: [0, 15, -15, 0],
            scale: [1, 1.12, 1],
            filter: ['drop-shadow(0 0 2px rgba(251, 191, 36, 0.4))', 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))', 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.4))']
          },
          transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Camera':
        return {
          animate: {
            scale: [1, 1.08, 1],
            y: [0, -1.5, 0]
          },
          transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'MessageCircle':
      case 'MessageSquare':
        return {
          animate: {
            scale: [1, 1.1, 1],
            rotate: [0, -4, 4, 0]
          },
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Star':
        return {
          animate: {
            rotate: [0, 12, -12, 0],
            scale: [1, 1.15, 1]
          },
          transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Flame':
        return {
          animate: {
            scaleY: [1, 1.15, 0.95, 1],
            rotate: [-2, 2, -2],
            y: [0, -1, 0]
          },
          transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Zap':
        return {
          animate: {
            scale: [1, 1.2, 0.95, 1],
            opacity: [0.9, 1, 0.85, 1]
          },
          transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Heart':
        return {
          animate: {
            scale: [1, 1.22, 1, 1.15, 1]
          },
          transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Gift':
        return {
          animate: {
            rotate: [0, -8, 8, -4, 0],
            y: [0, -2, 0]
          },
          transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Package':
      case 'ShoppingBag':
        return {
          animate: {
            y: [0, -2.5, 0]
          },
          transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
        };

      case 'Phone':
        return {
          animate: {
            rotate: [0, -12, 12, -12, 12, 0]
          },
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }
        };

      case 'Globe':
        return {
          animate: {
            rotate: [0, 360]
          },
          transition: { duration: 18, repeat: Infinity, ease: 'linear' }
        };

      default:
        return {
          animate: {
            y: [0, -1.5, 0]
          },
          transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        };
    }
  };

  const match = ICON_OPTIONS.find((opt) => opt.id === name);
  const IconComp = match ? match.icon : Sparkles;
  const motionProps = getMotionAnimation();

  return (
    <motion.div
      className="relative inline-flex items-center justify-center shrink-0 cursor-pointer"
      whileHover={{ scale: 1.2, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 450, damping: 18 }}
    >
      <motion.div {...motionProps} className="inline-flex items-center justify-center">
        <IconComp className={`${className} shrink-0`} />
      </motion.div>
    </motion.div>
  );
};
