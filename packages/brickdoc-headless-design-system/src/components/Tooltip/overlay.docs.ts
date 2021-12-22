export const overlayArgTypes = {
  placement: {
    description: '`Placement` Placement of the overlay',
    options: [
      'auto',
      'auto-start',
      'auto-end',
      'top',
      'right',
      'bottom',
      'left',
      'top-start',
      'top-end',
      'right-start',
      'right-end',
      'bottom-start',
      'bottom-end',
      'left-start',
      'left-end'
    ],
    control: {
      type: 'select'
    }
  },
  children: {
    description: `\`ReactElement\` Children should only be applied to natively focusable elements like \`<button>\` or
        \`<input>\`. If you are using a \`<div>\` or \`<span>\` element, ensure you add \`tabindex="0"\`
        so that it can receive focus.`,
    control: {
      type: null
    }
  },
  isDisabled: {
    description: '`boolean` Whether the overlay is disabled',
    control: {
      type: 'boolean'
    }
  },
  isVisible: {
    description: '`boolean|undefined` Whether the overlay is visible in **Controlled mode**',
    control: {
      type: 'boolean'
    }
  },
  defaultVisible: {
    description: '`boolean` Whether the overlay is visible in **Uncontrolled mode**',
    control: {
      type: 'boolean'
    }
  },
  trigger: {
    description: '`Trigger` Determines the events that cause the tippy to show',
    options: ['click', 'manual', 'mouseenter focus', 'contextmenu'],
    control: {
      type: 'radio'
    }
  },
  touch: {
    description: '`boolean | "hold" | ["hold", number]` Whether the overlay should be shown on touch devices'
  },
  hideOnClick: {
    description: '`boolean|"toggle"` Whether the overlay should be hidden when the user clicks anywhere'
  },
  interactiveBorder: {
    description: `\`number\` Determines the size (px) of the invisible border around the tippy that will
       prevent it from hiding if the cursor left it`,
    control: {
      type: 'number'
    }
  },
  offset: {
    description: `\`[number, number]\` Displaces the overlay from its reference element in pixels
      (skidding and distance). See [Popper's docs](https://popper.js.org/docs/v2/modifiers/offset/) for details`
  },
  triggerTarget: {
    description: `\`Element | Element[]\` The element(s) that the trigger event listeners are added to.
      Allows you to separate the tippy's positioning from its trigger source`
  },
  appendTo: {
    description: `\`Element | "parent" | ((ref: Element) => Element)\` The element to append the overlay to.
      \n**Default is \`parent\`**`
  },
  hasArrow: {
    description: '`boolean` Whether the overlay should have an arrow',
    control: {
      type: 'boolean'
    }
  },
  removeOnHide: {
    description: '`boolean` Whether the overlay should be removed from the DOM when hidden',
    control: {
      type: 'boolean'
    }
  },
  onVisibleChange: {
    description: `\`(isVisible: boolean) => void|false\` Callback executed when visibility changes.
        You can optionally \`return false\` to cancel the visibility change`
  },
  onTrigger: {
    description: `\`(instance: Instance<Props>, event: Event) => void\`
      Callback executed when the trigger event is fired.`
  },
  onUntrigger: {
    description: `\`(instance: Instance<Props>, event: Event) => void\`
      Callback executed when the untrigger event is fired.`
  }
}
