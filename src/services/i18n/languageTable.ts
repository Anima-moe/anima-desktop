

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const languageTable = {
  'en-US': {
    translation: {
      splash_welcome: `Let's get started!`,
      splash_continueAsGuest: 'Continue without an account',
      splash_loginOrRegister: 'Login/Register',
      splash_joinDiscord: 'Join us on our Discord server',
      splash_user: 'Username',
      splash_password: 'Password',

      cta_watchTrailer: 'Trailer',
      cta_watchNow: 'Watch',
      cta_seeMore: 'See more',
      cta_seeLess: 'See less',

      section_continueWatching: 'Continue Watching',
      section_popular: 'Popular',
      section_latest: 'Latest',
      section_categories: 'Categories',
      section_simulcast: 'Simulcast',

      anime_heading_characters: 'Characters',
      anime_heading_casting: 'Casting',
      anime_heading_staff: 'Staff Members',
      anime_heading_launchdate: 'Launch Date',
      anime_heading_synopsis: 'Synopsis',
      anime_heading_rating: 'Rating',
      anime_heading_averageScore: 'Average Score',
      anime_heading_meanScore: 'Mean Score',
      anime_heading_synonyms: 'Synonyms',
      anime_heading_status: 'Status',
      anime_heading_endDate: 'End Date',

      anime_generic_season: '{{n}} Season',
      anime_generic_seasons: '{{n}} Seasons',
      anime_generic_episode: 'Episode {{n}}',
      anime_generic_episodes: '{{n}} Episodes',

      anime_episodes: 'Episodes',

      generic_date: '{{month}}/{{day}}/{{year}}',

      anilist_status_NOT_YET_RELEASED: 'Not Yet Released',
      anilist_status_FINISHED: 'Finished',
      anilist_status_RELEASING: 'Releasing',
      anilist_status_CANCELED: 'Canceled',
      anilist_status_HIATUS: 'Hiatus',
      anilist_status_ONGOING: 'Ongoing',
      anilist_status_ANNOUNCED: 'Announced',
      anilist_status_TBA: 'TBA',
      anilist_status_UNRELEASED: 'Unreleased',
      anilist_status_UPCOMING: 'Upcoming',

      search_placeholder: 'Search',
      search_prompt: 'Search for anime titles',
      search_moredata: 'The search query must contain 3 or more characters OR one category',


      api_fetchError: 'Oops! Something went wrong. Please try again later.',

      loading_moreData: 'Loading more ...',
    },
  },
  'pt-BR': {
    translation: {
      splash_welcome: `Vamos começar.`,
      splash_continueAsGuest: 'Continuar sem uma conta',
      splash_loginOrRegister: 'Login/Registro',
      splash_joinDiscord: 'Junte-se ao nosso servidor do discord!',
      splash_user: 'Usuário',
      splash_password: 'Senha',

      nav_link_home: 'Início',
      nav_link_categories: 'Categorias',
      nav_link_donate: 'Doar',

      cta_watchTrailer: 'Trailer',
      cta_watchNow: 'Assistir',
      cta_seeMore: 'Ver mais',
      cta_seeLess: 'Ver menos',

      section_continueWatching: 'Continue Assistindo',
      section_popular: 'Popular',
      section_latest: 'Mais recented',
      section_categories: 'Categorias',
      section_simulcast: 'Temporada atual',

      anime_heading_characters: 'Personagens',
      anime_heading_casting: 'Elenco',
      anime_heading_staff: 'Membros da Staff',
      anime_heading_launchdate: 'Lançamento',
      anime_heading_synopsis: 'Sinopse',
      anime_heading_rating: 'Avaliação',
      anime_heading_averageScore: 'Nota Média',
      anime_heading_meanScore: 'Nota Média',
      anime_heading_synonyms: 'Sinônimos',
      anime_heading_status: 'Status',
      anime_heading_endDate: 'Data de Término',

      anime_generic_season: '{{n}}ª Temporada',
      anime_generic_seasons: '{{n}} Temporadas',
      anime_generic_episode: 'Episódio {{n}}',
      anime_generic_episodes: '{{n}} Episódios',

      anime_episodes: 'Episódios',

      generic_date: '{{day}}/{{month}}/{{year}}',
      anilist_status_NOT_YET_RELEASED: 'Não Lançado',
      anilist_status_FINISHED: 'Finalizado',
      anilist_status_RELEASING: 'Em Lançamento',
      anilist_status_CANCELED: 'Cancelado',
      anilist_status_HIATUS: 'Hiatus',
      anilist_status_ONGOING: 'Em Andamento',
      anilist_status_ANNOUNCED: 'Anunciado',
      anilist_status_TBA: 'ASA',
      anilist_status_UNRELEASED: 'Não Lançado',
      anilist_status_UPCOMING: 'Em Breve',

      search_placeholder: 'Pesquisar',
      search_prompt: 'Busque por título de animes',
      search_moredata: 'A busca deve conter 3 ou mais caracteres OU uma categoria',

      api_fetchError: 'Oops! Algo deu errado ao obter os dados do servidor. Tente novamente mais tarde.',

      loading_moreData: 'Carregando mais...',
    },
  },
  'es-149': {
  }
};


export default languageTable;