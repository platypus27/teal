import type { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType, ReactElement } from 'react'

export type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>['ref']

export type PolymorphicProps<C extends ElementType, OwnProps extends object = object> = OwnProps & {
  as?: C
} & Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | 'as'>

export type PolymorphicComponent<
  DefaultElement extends ElementType,
  OwnProps extends object,
> = <C extends ElementType = DefaultElement>(
  props: PolymorphicProps<C, OwnProps> & { ref?: PolymorphicRef<C> },
) => ReactElement | null
