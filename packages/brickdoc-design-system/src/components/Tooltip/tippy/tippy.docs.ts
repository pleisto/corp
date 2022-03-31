export const TIPPY_ARG_TYPES = {
  children: {
    description: 'The anchor (trigger) of the popper.',
    control: { type: null }
  },
  className: {
    type: 'string',
    description: 'The CSS class to be applied to the **content**.'
  },
  style: {
    type: 'object',
    description: 'The CSS inline style to be applied to the **content**.'
  },
  animation: {
    type: 'string',
    defaultValue: 'scale',
    description:
      'The type of transition animation. See [Animations](https://atomiks.github.io/tippyjs/v6/animations/) for details.'
  },
  aria: {
    type: 'object',
    description:
      'The aria attribute configuration. See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#aria) for details.'
  },
  arrow: {
    type: 'boolean',
    defaultValue: true,
    description: 'Determines if the popper has an arrow.'
  },
  delay: {
    type: 'number',
    description:
      'Delay in ms once a trigger event is fired before the popper shows or hides. ' +
      'A tuple can be assgined to specify the delay of showing and hiding, respectively.'
  },
  duration: {
    type: 'number',
    defaultValue: 200,
    description:
      'Duration in ms of the transition animation. ' +
      'A tuple can be assigned to specify the duration of showing and hiding, respectively.'
  },
  followCursor: {
    type: 'boolean',
    description: `Determines if the popper follows the user's mouse cursor.`
  },
  hideOnClick: {
    type: 'boolean',
    description:
      'Determines if the popper hides upon clicking the reference or outside of the popper. ' +
      'See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#hideonclick) for details.'
  },
  inertia: {
    type: 'boolean',
    description: 'Determines if a (customizable) CSS spring-like animation is applied to the transition animation.'
  },
  interactive: {
    type: 'boolean',
    description:
      'Determines if the popper has interactive content inside of it, so that it can be hovered over and clicked inside without hiding.'
  },
  interactiveBorder: {
    type: 'number',
    description:
      'Determines the size of the invisible border around the popper that will prevent it from hiding if the cursor left it.'
  },
  interactiveDebounce: {
    type: 'number',
    description: `Determines the time in ms to debounce the interactive hide handler when the cursor leaves the popper's interactive region.`
  },
  maxWidth: {
    type: 'number',
    description:
      'Specifies the maximum width of the popper. Useful to prevent it from being too horizontally wide to read.'
  },
  moveTransition: {
    type: 'string',
    description:
      'Specifies the transition applied to the root positioned popper node. This describes the transition between "moves" (or position updates) of the popper element when it e.g. flips or changes target location.'
  },
  offset: {
    description: 'Displaces the popper from its reference element in pixels (skidding and distance).'
  },
  placement: {
    description: 'The _preferred_ placement of the popper.',
    control: { type: 'radio' },
    options: [
      'top',
      'top-start',
      'top-end',
      'right',
      'right-start',
      'right-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'auto',
      'auto-start',
      'auto-end'
    ]
  },
  popperOptions: {
    type: 'object',
    description:
      'Specifies custom Popper options. See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#popperoptions) for details.'
  },
  role: {
    type: 'string',
    description: 'Specifies the role attribute on the popper element.'
  },
  showOnCreate: {
    type: 'boolean',
    description: 'Determines if the popper is shown once it gets created, respecting `delay`.'
  },
  touch: {
    description:
      'Determines the behavior on touch devices. See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#touch) for details.'
  },
  trigger: {
    description: 'Determines the events that cause the popper to show. Multiple event names are separated by spaces.',
    control: { type: 'radio' },
    options: ['mouseenter', 'click', 'focusin', 'manual']
  },
  zIndex: {
    type: 'number',
    description: 'Specifies the z-index CSS on the root popper node.'
  }
}
