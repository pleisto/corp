export const priority = {
  primary: {
    backgroundColor: '$color-primary-default',
    color: '$white',

    '&[disabled]': {
      border: '1px solid $color-broder-primary',
      backgroundColor: '$color-primary-disable',
      color: '$color-type-disable',
      cursor: 'not-allowed'
    },
    '&:hover, &:focus, &:active': {
      textDecoration: 'none',
      backgroundColor: '$color-primary-hover'
    }
  },
  'primary-press': {
    backgroundColor: '$color-primary-pressed',
    color: '$white'
  },

  secondary: {
    backgroundColor: '$white',
    border: '1px solid $color-broder-secondary',
    color: '$color-type-primary',
    '&:hover, &:focus, &:active': {
      textDecoration: 'none',
      backgroundColor: '$color-background-secondary'
    },
    '&[disabled]': {
      cursor: 'not-allowed'
    },
    '&-press': {}
  },
  'secondary-press': {
    backgroundColor: '$grey-3',
    color: '$color-type-primary'
  },

  ghost: {
    backgroundColor: '$white',
    color: '$color-type-primary',
    '&:hover, &:focus, &:active': {
      textDecoration: 'none',
      backgroundColor: '$color-background-primary'
    },
    '&[disabled]': {
      cursor: 'not-allowed'
    }
  },
  'ghost-press': {
    backgroundColor: '$grey-3',
    color: '$color-type-primary'
    // transition: 'background .3s $ease-in-out'
  },

  danger: {
    backgroundColor: '$color-error-default',
    color: '$white',
    '&:hover, &:focus, &:active': {
      textDecoration: 'none',
      backgroundColor: '$color-error-hover'
    },
    '&[disabled]': {
      border: '1px solid $color-broder-primary',
      backgroundColor: '$color-primary-disable',
      color: '$color-type-disable',
      cursor: 'not-allowed'
    }
  },
  'danger-press': {
    backgroundColor: '$color-error-pressed',
    color: '$white'
  }
}
