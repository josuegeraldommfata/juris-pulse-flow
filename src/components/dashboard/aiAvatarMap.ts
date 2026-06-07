export type AiAvatarKey =
  | 'trabalhista'
  | 'civil'
  | 'familia'
  | 'penal'
  | 'empresarial'
  | 'previdenciario'
  | 'consumidor'
  | 'tributario'
  | 'imobiliario'
  | 'administrativo';

/**
 * URL de avatar humano.
 * Use imagens reais colocando arquivos em `public/`.
 */
export const AI_AVATAR_BY_KEY: Record<AiAvatarKey, string> = {
  // DR (masculino)
  trabalhista: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  penal: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  empresarial: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  consumidor: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  tributario: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',

  // DRA (feminino)
  civil: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  familia: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
  previdenciario: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  imobiliario: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  administrativo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
};


