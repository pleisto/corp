export const TIPPY_ARG_TYPES = {
  children: {
    type: 'ReactChild | ReactFragment',
    description: 'The trigger of the popper.'
  },
  animation: {
    type: `"scale" | "fade"`,
    defaultValue: 'scale',
    description:
      'The type of transition animation. See [Animations](https://atomiks.github.io/tippyjs/v6/animations/) for details.'
  },
  aria: {
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
    defaultValue: 200,
    description:
      'Duration in ms of the transition animation. ' +
      'A tuple can be assigned to specify the duration of showing and hiding, respectively.'
  },
  followCursor: {
    description: `Determines if the popper follows the user's mouse cursor.`
  },
  hideOnClick: {
    description:
      'Determines if the popper hides upon clicking the reference or outside of the popper. ' +
      'See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#hideonclick) for details.'
  },
  inertia: {
    description: 'Determines if a (customizable) CSS spring-like animation is applied to the transition animation.'
  },
  interactive: {
    description:
      'Determines if the popper has interactive content inside of it, so that it can be hovered over and clicked inside without hiding.'
  },
  interactiveBorder: {
    description:
      'Determines the size of the invisible border around the popper that will prevent it from hiding if the cursor left it.'
  },
  interactiveDebounce: {
    description: `Determines the time in ms to debounce the interactive hide handler when the cursor leaves the popper's interactive region.`
  },
  maxWidth: {
    description:
      'Specifies the maximum width of the popper. Useful to prevent it from being too horizontally wide to read.'
  },
  moveTransition: {
    description:
      'Specifies the transition applied to the root positioned popper node. This describes the transition between "moves" (or position updates) of the popper element when it e.g. flips or changes target location.'
  },
  offset: {
    description: 'Displaces the popper from its reference element in pixels (skidding and distance).'
  },
  placement: {
    description: 'The _preferred_ placement of the popper.'
  },
  popperOptions: {
    description:
      'Specifies custom Popper options. See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#popperoptions) for details.'
  },
  role: {
    description: 'Specifies the role attribute on the popper element.'
  },
  showOnCreate: {
    description: 'Determines if the popper is shown once it gets created, respecting `delay`.'
  },
  touch: {
    description:
      'Determines the behavior on touch devices. See [Tippy.js](https://atomiks.github.io/tippyjs/v6/all-props/#touch) for details.'
  },
  trigger: {
    type: '"mouseenter" | "focus" | "click" | "focusin" | "manual"',
    description: 'Determines the events that cause the popper to show. Multiple event names are separated by spaces.'
  },
  zIndex: {
    description: 'Specifies the z-index CSS on the root popper node.'
  }
}
