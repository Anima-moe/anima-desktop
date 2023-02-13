import { forwardRef } from 'react'

import { Check, Minus } from 'phosphor-react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content {...props} ref={forwardedRef}>
        {children}
        <DropdownMenuPrimitive.Arrow className="fill-secondary" />
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
})
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuLabel = DropdownMenuPrimitive.Label
export const DropdownMenuItem = DropdownMenuPrimitive.Item
export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.MenuCheckboxItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem {...props} ref={forwardedRef}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator>
        {props.checked === 'indeterminate' && <Minus />}
        {props.checked === true && <Check />}
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  )
})
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.MenuRadioItemProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.RadioItem {...props} ref={forwardedRef}>
      {children}
      <DropdownMenuPrimitive.ItemIndicator>
        <Check />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.RadioItem>
  )
})
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator
