import React, { useState, useCallback } from 'react'
import { 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  Shield, 
  Award, 
  Eye, 
  EyeOff, 
  Check,
  AlertCircle,
  Brain,
  Bot,
  Sparkles,
  Zap
} from 'lucide-react'
import { useSessionVotes } from '../hooks/useSessionVotes'
import { usePromptActions } from '../hooks/usePromptActions'
import { useTopPrompts } from '../hooks/useTopPrompts'
import type { Prompt } from '../types'
import { RedirectButton } from './RedirectButton'

interface PromptCardProps {
  prompt: Prompt
  isTopPrompt?: boolean
  onUpdate?: (promptId: string, updates: Partial<Prompt>) => void
  onTagClick?: (tag: string) => void
}

// ENHANCED AI MODEL ICONS with improved animations
const ChatGPTIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
  </svg>
)

const DALLEIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <g fillRule="evenodd">
      <path d="M0 10h4.8v5H0z" fill="#FFFF67"/>
      <path d="M4.8 10h4.8v5H4.8z" fill="#43FFFF"/>
      <path d="M9.6 10h4.8v5H9.6z" fill="#51DA4B"/>
      <path d="M14.4 10h4.8v5h-4.8z" fill="#FF6E3D"/>
      <path d="M19.2 10H24v5h-4.8z" fill="#3C46FF"/>
    </g>
  </svg>
)

const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#da7756">
    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fillRule="nonzero"/>
  </svg>
)

const GeminiIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="gemini-gradient-card" x1="0%" x2="68.73%" y1="100%" y2="30.395%">
        <stop offset="0%" stopColor="#1C7DFF"/>
        <stop offset="52.021%" stopColor="#1C69FF"/>
        <stop offset="100%" stopColor="#F0DCD6"/>
      </linearGradient>
    </defs>
    <path d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12" fill="url(#gemini-gradient-card)" fillRule="nonzero"/>
  </svg>
)

const MidjourneyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" fillRule="evenodd">
    <path d="M22.369 17.676c-1.387 1.259-3.17 2.378-5.332 3.417.044.03.086.057.13.083l.018.01.019.012c.216.123.42.184.641.184.222 0 .426-.061.642-.184l.018-.011.019-.011c.14-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.304-.174.612-.266.949-.266.337 0 .645.092.949.266l.023.014c.188.109.334.219.602.442l.178.148c.221.184.346.278.483.36l.028.017.018.01c.21.12.407.181.62.185h.022a.31.31 0 110 .618c-.337 0-.645-.092-.95-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.02-.014a5.356 5.356 0 01-.49-.377l-.159-.132a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.641.184l-.02.011-.018.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.95.266c-.337 0-.644-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.026-.017a4.881 4.881 0 01-.425-.325.308.308 0 01-.12-.1l-.098-.081a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.642.184l-.018.011-.019.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.023.014-.022.014-.09.054A1.868 1.868 0 0112 22c-.337 0-.645-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.021-.014a5.356 5.356 0 01-.49-.377l-.158-.132a3.836 3.836 0 00-.483-.36l-.028-.017-.018-.01a1.256 1.256 0 00-.642-.185c-.221 0-.425.061-.641.184l-.019.011-.018.011c-.141.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.511.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.986.264c-.746-.09-1.319-.38-1.89-.866l-.035-.03c-.047-.041-.118-.106-.192-.174l-.196-.181-.107-.1-.011-.01a1.531 1.531 0 00-.336-.253.313.313 0 00-.095-.03h-.005c-.119.022-.238.059-.361.11a.308.308 0 01-.077.061l-.008.005a.309.309 0 01-.126.034 5.66 5.66 0 00-.774.518l-.416.324-.055.043a6.542 6.542 0 01-.324.236c-.305.207-.552.315-.8.315a.31.31 0 01-.01-.618h.01c.09 0 .235-.062.438-.198l.04-.027c.077-.054.163-.117.27-.199l.385-.301.06-.047c.268-.206.506-.373.73-.505l-.633-1.21a.309.309 0 01.254-.451l20.287-1.305a.309.309 0 01.228.537zm-1.118.14L2.369 19.03l.423.809c.128-.045.256-.078.388-.1a.31.31 0 01.052-.005c.132 0 .26.032.386.093.153.073.294.179.483.35l.016.015.092.086.144.134.097.089c.065.06.125.114.16.144.485.418.948.658 1.554.736h.011a1.25 1.25 0 00.6-.172l.021-.011.019-.011.018-.011c.141-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.305-.174.612-.266.95-.266.336 0 .644.092.948.266l.023.014c.188.109.335.219.603.442l.177.148c.222.184.346.278.484.36l.027.017.019.01c.215.124.42.185.641.185.222 0 .426-.061.641-.184l.019-.011.018-.011c.141-.084.267-.178.493-.366l.177-.148c.28-.232.427-.342.626-.456.304-.174.612-.266.949-.266.337 0 .644.092.949.266l.025.015c.187.109.334.22.603.443 1.867-.878 3.448-1.811 4.73-2.832l.02-.016zM3.653 2.026C6.073 3.06 8.69 4.941 10.8 7.258c2.46 2.7 4.109 5.828 4.637 9.149a.31.31 0 01-.421.335c-2.348-.945-4.54-1.258-6.59-1.02-1.739.2-3.337.792-4.816 1.703-.294.182-.62-.182-.405-.454 1.856-2.355 2.581-4.99 2.343-7.794-.195-2.292-1.031-4.61-2.284-6.709a.31.31 0 01.388-.442zM10.04 4.45c1.778.543 3.892 2.102 5.782 4.243 1.984 2.248 3.552 4.934 4.347 7.582a.31.31 0 01-.401.38l-.022-.01-.386-.154a10.594 10.594 0 00-.291-.112l-.016-.006c-.68-.247-1.199-.291-1.944-.101a.31.31 0 01-.375-.218C15.378 11.123 13.073 7.276 9.775 5c-.291-.201-.072-.653.266-.55zM4.273 2.996l.008.015c1.028 1.94 1.708 4.031 1.885 6.113.213 2.513-.31 4.906-1.673 7.092l-.02.031.003-.001c1.198-.581 2.47-.969 3.825-1.132l.055-.006c1.981-.23 4.083.029 6.309.837l.066.025-.007-.039c-.593-2.95-2.108-5.737-4.31-8.179l-.07-.078c-1.785-1.96-3.944-3.6-6.014-4.65l-.057-.028zm7.92 3.238l.048.048c2.237 2.295 3.885 5.431 4.974 9.191l.038.132.022-.004c.71-.133 1.284-.063 1.963.18l.027.01.066.024.046.018-.025-.073c-.811-2.307-2.208-4.62-3.936-6.594l-.058-.065c-1.02-1.155-2.103-2.132-3.15-2.856l-.015-.011z"/>
  </svg>
)

const PerplexityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.06 2.52L11.46 7.49V7.49V2.53H12.51V7.58L17.93 2.52V8.19H20.16V16.37H17.94V21.42L12.51 16.65V21.48H11.46V16.73L6.07 21.48V16.37H3.84V8.19H6.06V2.52ZM10.67 9.23H4.89V15.33H6.06V13.41L10.67 9.23ZM7.12 13.87V19.16L11.46 15.34V9.92L7.12 13.87ZM12.54 15.29V9.92L16.88 13.86V16.37H16.89V19.15L12.54 15.29ZM17.94 15.33H19.11V9.23H13.38L17.94 13.36V15.33ZM16.88 8.19V4.91L13.32 8.19H16.88ZM10.68 8.19H7.12V4.91L10.68 8.19Z"/>
  </svg>
)

const GPT4Icon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
    <text x="12" y="16" textAnchor="middle" fontSize="6" fill="currentColor" fontWeight="bold">4</text>
  </svg>
)

// OFFICIAL GROK ICON - Updated with provided SVG
const GrokIcon = ({ className }: { className?: string }) => (
  <svg fill="currentColor" fillRule="evenodd" height="1em" style={{flex:'none',lineHeight:1}} viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" className={className}>
    <title>Grok</title>
    <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path>
  </svg>
)

// ENHANCED AI Model Icon Mapping with improved animations and effects
const getAIModelIcon = (model: string) => {
  const modelConfig = {
    'chatgpt': { 
      icon: ChatGPTIcon, 
      color: 'from-green-500 via-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-500/20 to-emerald-500/10',
      textColor: 'text-green-400',
      name: 'ChatGPT',
      glow: 'shadow-green-500/25'
    },
    'gpt-4': { 
      icon: GPT4Icon, 
      color: 'from-green-400 via-emerald-400 to-green-500',
      bgColor: 'bg-gradient-to-br from-green-400/20 to-emerald-400/10',
      textColor: 'text-green-400',
      name: 'GPT-4',
      glow: 'shadow-green-400/25'
    },
    'claude': { 
      icon: ClaudeIcon,
      color: 'from-gray-600 via-gray-500 to-gray-700',
      bgColor: 'bg-gradient-to-br from-gray-600/20 to-gray-500/10',
      textColor: 'text-gray-400',
      name: 'Claude',
      glow: 'shadow-gray-500/25'
    },
    'dalle': { 
      icon: DALLEIcon,
      color: 'from-orange-500 via-red-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-orange-500/20 to-red-500/10',
      textColor: 'text-orange-400',
      name: 'DALL-E',
      glow: 'shadow-orange-500/25'
    },
    'midjourney': { 
      icon: MidjourneyIcon,
      color: 'from-pink-500 via-rose-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-pink-500/20 to-rose-500/10',
      textColor: 'text-pink-400',
      name: 'Midjourney',
      glow: 'shadow-pink-500/25'
    },
    'gemini': { 
      icon: GeminiIcon,
      color: 'from-blue-500 via-cyan-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/10',
      textColor: 'text-blue-400',
      name: 'Gemini',
      glow: 'shadow-blue-500/25'
    },
    'perplexity': { 
      icon: PerplexityIcon,
      color: 'from-teal-500 via-cyan-600 to-blue-600',
      bgColor: 'bg-gradient-to-br from-teal-500/20 to-cyan-600/10',
      textColor: 'text-teal-400',
      name: 'Perplexity',
      glow: 'shadow-teal-500/25'
    },
    'grok': { 
      icon: GrokIcon,
      color: 'from-black via-gray-900 to-black', // Czarny gradient dla Groka
      bgColor: 'bg-gradient-to-br from-black/20 to-gray-900/10',
      textColor: 'text-gray-300',
      name: 'Grok',
      glow: 'shadow-black/25'
    },
    'other': { 
      icon: Bot,
      color: 'from-gray-500 via-slate-500 to-gray-600',
      bgColor: 'bg-gradient-to-br from-gray-500/20 to-slate-500/10',
      textColor: 'text-gray-400',
      name: 'Other AI',
      glow: 'shadow-gray-500/25'
    }
  }

  return modelConfig[model as keyof typeof modelConfig] || modelConfig.other
}

export function PromptCard({ prompt, isTopPrompt = false, onUpdate, onTagClick }: PromptCardProps) {
  // Session-based voting system with anti-spam protection
  const { hasVoted, canVote, recordVote } = useSessionVotes()
  const { topIds } = useTopPrompts()
  const { hasLiked, hasDisliked } = hasVoted(prompt.id)
  
  // Prompt actions with loading states
  const { likePrompt, dislikePrompt, copyPrompt, recordUse, isLoading } = usePromptActions({
    onUpdate
  })

  // Local state with enhanced animations
  const [likesCount, setLikesCount] = useState(prompt.total_likes)
  const [dislikesCount, setDislikesCount] = useState(prompt.total_dislikes || 0)
  const [usesCount, setUsesCount] = useState(prompt.total_uses)
  const [showFullContent, setShowFullContent] = useState(false)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Get AI model configuration
  const modelConfig = getAIModelIcon(prompt.primary_model)
  const ModelIcon = modelConfig.icon

  // Clear error after 5 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // ENHANCED LIKE HANDLER with smooth animations
  const handleLike = useCallback(async () => {
    if (hasLiked || hasDisliked || isLoading(prompt.id, 'like')) {
      return
    }
    
    try {
      setError(null)
      const { likes } = await likePrompt(prompt.id, likesCount)
      setLikesCount(likes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to like prompt')
    }
  }, [hasLiked, hasDisliked, isLoading, likePrompt, prompt.id, likesCount])

  // ENHANCED DISLIKE HANDLER with smooth animations
  const handleDislike = useCallback(async () => {
    if (hasLiked || hasDisliked || isLoading(prompt.id, 'dislike')) {
      return
    }
    
    try {
      setError(null)
      const { dislikes } = await dislikePrompt(prompt.id, dislikesCount)
      setDislikesCount(dislikes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dislike prompt')
    }
  }, [hasLiked, hasDisliked, isLoading, dislikePrompt, prompt.id, dislikesCount])

  // Enhanced copy handler with premium feedback
  const handleCopy = useCallback(async () => {
    if (copyStatus !== 'idle') return
    
    try {
      setCopyStatus('copying')
      setError(null)
      
      const { uses } = await copyPrompt(prompt.id, prompt.content, usesCount)
      setUsesCount(uses)
      
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 3000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy prompt')
      setCopyStatus('idle')
    }
  }, [copyStatus, copyPrompt, prompt.id, prompt.content, usesCount])

  // Redirect use handler – only increments usage (no clipboard copy)
  const handleRedirectUse = useCallback(async () => {
    try {
      setError(null)
      const { uses } = await recordUse(prompt.id, usesCount)
      setUsesCount(uses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record prompt use')
    }
  }, [recordUse, prompt.id, usesCount])

  // Content display logic
  const truncatedContent = prompt.content.length > 300 
    ? prompt.content.substring(0, 300) + '...' 
    : prompt.content
  const displayContent = showFullContent ? prompt.content : truncatedContent
  const tags = prompt.prompt_tags?.map(pt => pt.tag) || []

  // Enhanced UI helper functions
  const getUseButtonText = () => {
    const modelLabels: Record<string, string> = {
      'chatgpt': 'Use in ChatGPT',
      'gpt-4': 'Use in GPT-4',
      'claude': 'Use in Claude',
      'dalle': 'Use in DALL-E',
      'midjourney': 'Use in Midjourney',
      'gemini': 'Use in Gemini',
      'perplexity': 'Use in Perplexity',
      'grok': 'Use in Grok'
    }
    return modelLabels[prompt.primary_model] || 'Use'
  }

  const getCopyButtonStyle = () => {
    switch (copyStatus) {
      case 'copying':
        return 'bg-blue-500/30 text-blue-200 border border-blue-400/50 cursor-wait scale-95 shadow-lg shadow-blue-500/20'
      case 'copied':
        return 'bg-green-500/30 text-green-200 border border-green-400/50 scale-105 shadow-xl shadow-green-500/30 animate-pulse'
      default:
        return 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-transparent hover:border-white/20 hover:shadow-lg hover:shadow-white/10 transition-all duration-300'
    }
  }

  const getCopyButtonIcon = () => {
    switch (copyStatus) {
      case 'copying':
        return <Copy className="h-4 w-4 animate-spin" />
      case 'copied':
        return <Check className="h-4 w-4 animate-bounce" />
      default:
        return <Copy className="h-4 w-4" />
    }
  }

  // Enhanced button styles with premium animations
  const getLikeButtonStyle = () => {
    if (hasLiked) {
      return 'bg-green-500/20 text-green-300 cursor-not-allowed opacity-75 border border-green-500/30 shadow-lg shadow-green-500/20'
    }
    if (hasDisliked) {
      return 'bg-gray-500/20 text-gray-500 cursor-not-allowed opacity-50 border border-gray-500/20'
    }
    if (isLoading(prompt.id, 'like')) {
      return 'bg-green-500/20 text-green-300 cursor-wait animate-pulse border border-green-500/30 shadow-lg shadow-green-500/20'
    }
    return 'bg-white/10 hover:bg-green-500/20 hover:text-green-300 text-gray-300 border border-transparent hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:scale-105'
  }

  const getDislikeButtonStyle = () => {
    if (hasDisliked) {
      return 'bg-red-500/20 text-red-300 cursor-not-allowed opacity-75 border border-red-500/30 shadow-lg shadow-red-500/20'
    }
    if (hasLiked) {
      return 'bg-gray-500/20 text-gray-500 cursor-not-allowed opacity-50 border border-gray-500/20'
    }
    if (isLoading(prompt.id, 'dislike')) {
      return 'bg-red-500/20 text-red-300 cursor-wait animate-pulse border border-red-500/30 shadow-lg shadow-red-500/20'
    }
    return 'bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-gray-300 border border-transparent hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-105'
  }

  // SPECIAL STYLING FOR GROK USE BUTTON - Biały tekst na czarnym tle z POPRAWNYM ROZMIAREM
  const getUseButtonStyle = () => {
    if (prompt.primary_model === 'grok') {
      return `
        flex items-center space-x-2 px-3 sm:px-4 py-2 
        bg-black hover:bg-gray-900 
        hover:scale-105 hover:shadow-xl hover:shadow-black/50
        rounded-xl font-medium transition-all duration-300 
        text-white shadow-lg text-sm flex-shrink-0 min-w-0
        relative overflow-hidden group/use border border-gray-700 hover:border-gray-600
      `
    } else {
      return `
        flex items-center space-x-2 px-3 sm:px-4 py-2 
        bg-gradient-to-r ${modelConfig.color} 
        hover:opacity-90 hover:scale-105 hover:shadow-xl hover:${modelConfig.glow}
        rounded-xl font-medium transition-all duration-300 
        text-white shadow-lg text-sm flex-shrink-0 min-w-0
        relative overflow-hidden group/use
      `
    }
  }

  // Quality indicators with enhanced visuals
  const shouldShowAward = topIds.has(prompt.id) || usesCount >= 100
  const difficultyColors = {
    beginner: 'text-green-400',
    intermediate: 'text-yellow-400',
    advanced: 'text-red-400'
  }

  return (
    <div 
      className={`
        relative group
        bg-gradient-to-br from-white/5 via-white/10 to-white/5 
        backdrop-blur-xl rounded-3xl p-4 sm:p-6 
        hover:from-white/10 hover:via-white/15 hover:to-white/10
        transition-all duration-500 ease-out
        border border-white/10 hover:border-white/20
        hover:shadow-2xl hover:shadow-purple-500/10
        hover:scale-[1.02] hover:-translate-y-1
        ${isHovered ? 'ring-2 ring-purple-500/20' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Error Message with enhanced styling */}
      {error && (
        <div className="mb-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-xl p-3 flex items-center space-x-2 animate-slide-up">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 animate-pulse" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Header with Enhanced AI Model Icon */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Enhanced Official AI Model Icon with premium effects */}
          <div className={`
            relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl 
            bg-gradient-to-br ${modelConfig.color} 
            flex items-center justify-center 
            group-hover:scale-110 group-hover:rotate-3
            transition-all duration-500 ease-out
            shadow-xl ${modelConfig.glow}
            before:absolute before:inset-0 before:rounded-2xl 
            before:bg-gradient-to-br before:from-white/20 before:to-transparent 
            before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
            flex-shrink-0
          `}>
            <ModelIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10 drop-shadow-lg" />
            {/* Animated glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${modelConfig.color} opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-wrap min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 min-w-0">
                  {prompt.title}
                </h3>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {prompt.is_verified && (
                    <div className="relative">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 animate-pulse" />
                      <div className="absolute inset-0 h-3 w-3 sm:h-4 sm:w-4 text-green-400 animate-ping opacity-20" />
                    </div>
                  )}
                  {shouldShowAward && (
                    <div className="relative">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 animate-bounce" />
                      <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-yellow-300 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Enhanced usage count indicator */}
              <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 flex-shrink-0 ml-2 bg-white/5 rounded-full px-2 py-1 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                <span className="font-medium">{usesCount}</span>
              </div>
            </div>
            
            {/* Enhanced featured badge */}
            {prompt.is_featured && (
              <div className="mb-2 animate-slide-up">
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30 shadow-lg shadow-purple-500/20">
                  <Zap className="h-3 w-3 animate-pulse" />
                  <span>Featured</span>
                </div>
              </div>
            )}
            
            {/* Enhanced metadata with better mobile layout */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 flex-wrap">
              <span className={`capitalize font-medium ${modelConfig.textColor} flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1`}>
                <ModelIcon className="h-3 w-3" />
                <span>{modelConfig.name}</span>
              </span>
              <span>•</span>
              <span className={`capitalize ${difficultyColors[prompt.difficulty_level as keyof typeof difficultyColors]} font-medium`}>
                {prompt.difficulty_level}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">by {prompt.author_name}</span>
            </div>
            
            {/* Mobile-only author and quality with enhanced styling */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 sm:hidden">
              <span className="bg-white/5 rounded-full px-2 py-0.5">by {prompt.author_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Description */}
      {prompt.description && (
        <p className="text-gray-300 mb-4 text-sm leading-relaxed bg-white/5 rounded-xl p-3 border border-white/10">
          {prompt.description}
        </p>
      )}

      {/* Enhanced Prompt Content with premium styling */}
      <div className="bg-gradient-to-br from-black/30 to-black/20 rounded-2xl p-3 sm:p-4 mb-4 border border-white/10 relative overflow-hidden group/content">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover/content:opacity-100 transition-opacity duration-300" />
        
        <pre className="text-gray-200 text-xs sm:text-sm whitespace-pre-wrap font-mono leading-relaxed relative z-10">
          {displayContent}
        </pre>
        
        {prompt.content.length > 300 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs mt-3 font-medium transition-all duration-300 hover:scale-105 bg-blue-500/10 rounded-lg px-2 py-1 border border-blue-500/20"
          >
            {showFullContent ? (
              <>
                <EyeOff className="h-3 w-3" />
                <span>Show less</span>
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                <span>Show more</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Enhanced Technique Explanation */}
      {prompt.technique_explanation && (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-3 sm:p-4 mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-2xl" />
          <h4 className="text-blue-300 font-medium text-sm mb-2 flex items-center space-x-2">
            <Brain className="h-4 w-4 animate-pulse" />
            <span>Why This Works</span>
          </h4>
          <p className="text-blue-200 text-xs sm:text-sm leading-relaxed">
            {prompt.technique_explanation}
          </p>
        </div>
      )}

      {/* Enhanced Example Output */}
      {prompt.example_output && (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-3 sm:p-4 mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl" />
          <h4 className="text-green-300 font-medium text-sm mb-2 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Example Output</span>
          </h4>
          <p className="text-green-200 text-xs sm:text-sm leading-relaxed">
            {prompt.example_output}
          </p>
        </div>
      )}

      {/* Enhanced Tags with premium animations */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {tags.slice(0, 6).map((tag, index) => (
            <button
              key={index}
              onClick={() => onTagClick?.(tag)}
              className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full text-xs font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20 border border-blue-500/30"
              title={`Search for prompts with #${tag}`}
            >
              #{tag}
            </button>
          ))}
          {tags.length > 6 && (
            <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/30">
              +{tags.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Enhanced Actions and Stats with premium styling */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white/10 gap-3 sm:gap-0 relative z-10">
        {/* Enhanced Stats with animations */}
        <div className="flex items-center justify-center sm:justify-start space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 hover:bg-green-500/10 transition-colors duration-300">
            <ThumbsUp className="h-4 w-4 text-green-400" />
            <span className="font-medium">{likesCount}</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 hover:bg-red-500/10 transition-colors duration-300">
            <ThumbsDown className="h-4 w-4 text-red-400" />
            <span className="font-medium">{dislikesCount}</span>
          </div>
          <div className="flex items-center space-x-1 bg-white/5 rounded-full px-2 py-1 hover:bg-blue-500/10 transition-colors duration-300">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="font-medium">{usesCount}</span>
          </div>
        </div>

        {/* Enhanced Action Buttons with premium animations */}
        <div className="flex items-center justify-center sm:justify-end space-x-2 w-full sm:w-auto">
          {/* Enhanced Like Button */}
          <button
            onClick={handleLike}
            disabled={hasLiked || hasDisliked || isLoading(prompt.id, 'like')}
            className={`p-2 rounded-xl font-medium transition-all duration-300 flex-shrink-0 ${getLikeButtonStyle()}`}
            title={hasLiked ? 'You already liked this' : hasDisliked ? 'You already disliked this' : 'Like this prompt'}
          >
            <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Enhanced Dislike Button */}
          <button
            onClick={handleDislike}
            disabled={hasLiked || hasDisliked || isLoading(prompt.id, 'dislike')}
            className={`p-2 rounded-xl font-medium transition-all duration-300 flex-shrink-0 ${getDislikeButtonStyle()}`}
            title={hasDisliked ? 'You already disliked this' : hasLiked ? 'You already liked this' : 'Dislike this prompt'}
          >
            <ThumbsDown className={`h-4 w-4 ${hasDisliked ? 'fill-current' : ''}`} />
          </button>
          
          {/* Enhanced Copy Button with premium feedback */}
          <button
            onClick={handleCopy}
            disabled={copyStatus !== 'idle'}
            className={`p-2 rounded-xl font-medium transition-all duration-300 flex-shrink-0 ${getCopyButtonStyle()}`}
            title={copyStatus === 'copied' ? 'Copied to clipboard! ✓' : 'Copy prompt to clipboard'}
          >
            {getCopyButtonIcon()}
          </button>
          
          {/* Reusable RedirectButton for "Try in <Model>" */}
          <RedirectButton
            model={prompt.primary_model}
            promptContent={prompt.content}
            onUseComplete={handleRedirectUse}
            className={`${getUseButtonStyle()} relative overflow-hidden group/use`}
          >
            {/* Animated background - only for non-Grok models */}
            {prompt.primary_model !== 'grok' && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/use:translate-x-full transition-transform duration-700" />
            )}

            <ExternalLink className="h-4 w-4 flex-shrink-0 relative z-10" />
            <span className="hidden xs:inline sm:inline truncate relative z-10">{getUseButtonText()}</span>
            <span className="xs:hidden sm:hidden relative z-10">Use</span>
          </RedirectButton>
        </div>
      </div>
    </div>
  )
}