export const priority = {
  primary: {
    backgroundColor: '$color-primary-default',
    color: '$white',
    '&:hover, &:focus, &:active': {
      textDecoration: 'none',
      backgroundColor: '$color-primary-hover'
    },
    '&[disabled]': {
      border: '1px solid $color-broder-primary',
      backgroundColor: '$color-primary-disable',
      color: '$color-type-disable',
      cursor: 'not-allowed'
    }
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
    }
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
  }
}
