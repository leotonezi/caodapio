const dictionary = {
  'app.title': 'Cãodápio',
  'auth.emailLabel': 'E-mail',
  'auth.emailPlaceholder': 'voce@exemplo.com',
  'auth.sendLinkButton': 'Enviar link de acesso',
  'auth.checkEmail': 'Verifique seu e-mail para o link de acesso.',
  'auth.genericError': 'Não foi possível enviar o link. Tente novamente.',
  'auth.signOut': 'Sair',
  'household.loading': 'Carregando...',
  'household.createTitle': 'Criar grupo',
  'household.joinTitle': 'Entrar com código de convite',
  'household.householdNameLabel': 'Nome do grupo',
  'household.memberNameLabel': 'Seu nome',
  'household.dogNameLabel': 'Nome do cão',
  'household.createButton': 'Criar',
  'household.inviteCodeLabel': 'Código de convite',
  'household.joinButton': 'Entrar',
  'household.membersTitle': 'Membros',
  'household.dogLabel': 'Cão',
  'household.generateInviteButton': 'Gerar convite para Ana',
  'household.createError': 'Não foi possível criar o grupo.',
  'household.joinError': 'Código inválido, expirado ou já usado.',
} as const

type DictionaryKey = keyof typeof dictionary

export function t(key: DictionaryKey): string {
  return dictionary[key]
}
