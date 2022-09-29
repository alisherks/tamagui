import { useIsIntersecting } from '@tamagui/demos'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { GetProps, Separator, YStack, styled } from 'tamagui'

import { setTintIndex, useTint } from './useTint'

export const TintSection = ({
  children,
  index,
  themed,
  ...props
}: SectionProps & { themed?: boolean; index: number }) => {
  const top = useRef<HTMLElement>(null)
  const bottom = useRef<HTMLElement>(null)
  const { tint } = useTint()
  const isIntersecting = useIsIntersecting([top, bottom], {
    threshold: 0.6,
  })
  const [windowHeight, setWindowHeight] = useState(0)

  // ssr
  const next = useWindowDimensions().height
  useEffect(() => {
    setWindowHeight(next)
  }, [next])

  useEffect(() => {
    if (isIntersecting) {
      setTintIndex(index)
      listeners.forEach((cb) => cb(index))
    }
  }, [index, isIntersecting])

  return (
    <YStack pos="relative">
      <Separator
        ref={top}
        pos="absolute"
        t={-windowHeight * 0.33}
        l={0}
        r={0}
        o={0}
        // boc="red"
      />
      <Separator
        ref={bottom}
        pos="absolute"
        b={-windowHeight * 0.33}
        l={0}
        r={0}
        o={0}
        // boc="blue"
      />
      <Section {...(themed && { theme: tint })} {...props}>
        {useMemo(() => children, [children])}
      </Section>
    </YStack>
  )
}

const listeners = new Set<Function>()

export const useTintSectionIndex = (cb: (index: number) => void) => {
  useEffect(() => {
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  }, [])
}

export const Section = styled(YStack, {
  name: 'Section',
  pos: 'relative',
  className: 'content-visibility-auto',
  py: '$14',
  zi: 2,

  variants: {
    below: {
      true: {
        zi: 1,
      },
    },
  } as const,
})

type SectionProps = GetProps<typeof Section>

export const SectionTinted = ({
  children,
  gradient,
  extraPad,
  bubble,
  noBorderTop,
  ...props
}: any) => {
  const { tint } = useTint()
  const childrenMemo = useMemo(() => children, [children])

  return (
    <YStack
      zi={2}
      contain="paint"
      pos="relative"
      py="$14"
      elevation="$2"
      {...(bubble && {
        maw: 1400,
        br: '$6',
        bw: 1,
        boc: `$${tint}4`,
        als: 'center',
        width: '100%',
      })}
      {...props}
    >
      <YStack
        fullscreen
        className="all ease-in ms1000"
        zi={-1}
        o={0.4}
        bc={gradient ? `$${tint}2` : null}
        {...(!bubble && {
          btw: noBorderTop ? 0 : 1,
          bbw: 1,
          boc: `$${tint}3`,
        })}
      />
      {childrenMemo}
    </YStack>
  )
}