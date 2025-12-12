'use client'

import dynamic from 'next/dynamic'
import { SilkProps } from './Silk'

const Silk = dynamic(() => import('./Silk'), { ssr: false })

export default function SilkWrapper(props: SilkProps) {
  return <Silk {...props} />
}
