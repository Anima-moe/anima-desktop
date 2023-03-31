/* eslint-disable quotes */
/* eslint-disable import/no-anonymous-default-export */

export default {
  activity: {
    button: {
      access: 'Access',
      watch: 'Watch',
    },
    details: {
      browsing: '{{path}}',
      watching: 'EP{{spisode_number}}・{{episode}}',
    },
    status: {
      browsing: 'Browsing',
      watching: 'Watching',
    },
  },
  content: {
    report: {
      missingMetadata: 'Missing metadata',
      missingEpisodes: 'Missing episodes',
      error: 'Error',
    },
    alpha_reminger:
      'Hey! Anima is in alpha and we are still working on it.<br /> If you find animes missing metadata or episodes, please press the report button and paste the resulting code into our discord.',
    section: {
      continueWatching: 'Continue Watching',
      popular: 'Popular',
      latest: 'Latest',
      categories: 'Categories',
      simulcast: 'Winter season',
      staffPick: 'Staff Pick',
      comments: 'Comments',
      staff: 'Staff Members',
      characters: 'Characters',
    },
    anime: {
      property: {
        launchDate: 'Launch Date',
        synopsis: 'Synopsis',
        rating: 'Rating',
        averageScore: 'Average Score',
        meanScore: 'Mean Score',
        synonyms: 'Synonyms',
        status: 'Status',
        endDate: 'End Date',
        studios: 'Studios',
        episodes: 'Episodes',
      },
      generic: {
        season: '{{n}} Season',
        seasons: '{{n}} Seasons',
        episode: 'Episode {{n}}',
        episodes: '{{n}} Episodes',
      },
    },
    actions: {
      hideComments: 'Collapse',
      showComments: 'Expand',
      writeComment: 'Make a new comment',
      visitProfile: 'Visit profile',
      favorite: 'Add to favorites',
      reply: 'Reply',
      writeReply: 'Write a reply',
    },
  },
  splashScreen: {
    input: {
      user: 'Username',
      password: 'Password',
      email: 'Email',
    },
    coontent: {
      welcome: "Let's get started!",
    },
    updater: {
      versionAvailable: 'A new version is available. Update now?',
      refuseUpdate: 'Not now',
      acceptUpdate: 'Update',
      downloadingPending: 'Downloading update...',
      downloadingSuccess: 'Update downloaded. Restarting...',
      downloadingError: 'Error downloading update. Try again later.',
    },
    button: {
      continueAsGuest: 'Continue without an account',
      loginOrRegister: 'Login/Register',
      joinDiscord: 'Join us on our Discord server',
    },
  },
  navbar: {
    link: {
      home: 'Home',
      categories: 'Categories',
      donate: 'Donate',
      settings: 'Settings',
    },
    search: {
      placeholder: 'Search',
      prompt: 'Search for anime titles',
      moredata: 'The search query must contain 3 or more characters OR one category',
      noresult: 'No results found',
    },
    user: {
      menu: {
        profile: 'My profile',
        settings: 'Edit profile',
        signout: 'Sign out',
        login: 'Sign in',
      },
      edit: {
        email: 'E-mail',
        password: 'Password',
        avatar: 'Avatar',
        banner: 'Cover',
        background: 'Background',
        color: 'Color',
        subtitle: 'Subtitles',
        audio: 'Audio',
        history: 'History',
        history_public: 'Public',
        donator: 'Donator',
        save: 'Save',
        save_pending: 'Saving data',
        save_success: 'Data saved successfully',
        save_error: 'Error when saving data',
        save_animated: 'Only donators can use animated images',
        color_footer: 'Set your profile accent color',
        language: 'Language',
        bio: 'Bio',
      },
    },
  },
  genericCTA: {
    watchTrailer: 'Trailer',
    watchNow: 'Watch',
    seeMore: 'See more',
    seeLess: 'See less',
  },
  generic: {
    date: '{{month}}/{{day}}/{{year}}',
    accept: 'Accept',
    cancel: 'Cancel',
    copy: 'Copy',
  },
  anilist: {
    status: {
      notYetReleased: 'Not Yet Released',
      finished: 'Finished',
      releasing: 'Releasing',
      canceled: 'Canceled',
      hiatus: 'Hiatus',
      ongoing: 'Ongoing',
      announced: 'Announced',
      tba: 'TBA',
      unreleased: 'Unreleased',
      upcoming: 'Upcoming',
    },
  },
  error: {
    api: {
      fetchError: 'Oops... Something went wrong while trying to get data from our servers. Please try again later.',
      streamError: 'Oops... Something went wrong while trying to get a stream for this anime. Please try again later.',
      streamError_instructions:
        'You can help us solve this problem by reporting the error on our discord server, copy the information below and send it on the support channel on discord',
      streamLoading: 'Loading stream...',
    },
    generic: {
      error: 'Oops... Something went wrong. Please try again later.',
      notFound: 'Oops... This page does not exist.',
    },
  },
  loading_moreData: 'Loading more ...',

  user_minLength: 'Field must be at least {{n}} characters long',
  user_wrongAuth: 'Wrong username or password',
  user_missingField: 'Missing username or password',
  user_uniqueTaken: 'Username or email already taken',

  skip_chapter_credits: 'Skip credits',
  skip_chapter_preview: 'Skip preview',
  skip_chapter_mixed_credits: 'Skip mixed credits',
  skip_chapter_unknown: 'Skip chapter',
  skip_chapter_outro: 'Skip ending',
  skip_chapter_recap: 'Skip recap',
  skip_chapter_branding: 'Skip branding',
  skip_chapter_title_card: 'Skipt title',
  skip_chapter_intro: 'Skip opening',
  skip_chapter_new_intro: 'Skip new opening',
  skip_chapter_new_credits: 'Skip new credits',
  skip_chapter_op: 'Skip opening',
  skip_chapter_ed: 'Skip ending',
  skip_chapter_post_credits: 'Skip post credits',
  next_episode: 'Next episode',

  chapter_credits: 'Credits',
  chapter_preview: 'Preview',
  chapter_mixed_credits: 'Mixed credits',
  chapter_unknown: 'Chapter',
  chapter_outro: 'Ending',
  chapter_recap: 'Recap',
  chapter_branding: 'Branding',
  chapter_title_card: 'Title Card',
  chapter_intro: 'Opening',
  chapter_new_intro: 'New Intro',
  chapter_new_credits: 'New Credits',
  chapter_post_credits: 'Post credits',
  chapter_episode: 'Episode',
  chapter_op: 'Opening',
  chapter_teaser: 'Teaser',
  chapter_ed: 'Ending',
  chapter_canon: 'Canon',

  'ar-SA': 'العربية',
  'en-US': 'English',
  'pt-BR': 'Português (Brasil)',
  'pt-PT': 'Português (Portugal)',
  'de-DE': 'Deutsch',
  'ru-RU': 'Русский',
  'es-ES': 'Español',
  'es-419': 'Español (América Latina)',
  'fr-FR': 'Français',
  'it-IT': 'Italiano',
  'ja-JP': '日本語',
  none: 'Disabled',

  player_endtime: 'Ends at {{time}}',
}
