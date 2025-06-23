import React, { useState } from 'react'
import { 
  X, 
  Save, 
  AlertCircle, 
  Tag, 
  Lightbulb,
  Brain,
  Bot
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCategories } from '../hooks/useCategories'

interface AddPromptFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// UPDATED AI MODEL ICONS - Same as PromptCard
const ChatGPTIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
  </svg>
)

// NEW DALL-E ICON - Official Colorful Rectangles Design
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

// NEW CLAUDE ICON - Official Organic Shape Design (na szarym tle #585654 z kolorem #da7756)
const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#da7756">
    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" fillRule="nonzero"/>
  </svg>
)

// NEW GEMINI ICON - Official Gradient Design
const GeminiIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <defs>
      <linearGradient id="gemini-gradient-form" x1="0%" x2="68.73%" y1="100%" y2="30.395%">
        <stop offset="0%" stopColor="#1C7DFF"/>
        <stop offset="52.021%" stopColor="#1C69FF"/>
        <stop offset="100%" stopColor="#F0DCD6"/>
      </linearGradient>
    </defs>
    <path d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12" fill="url(#gemini-gradient-form)" fillRule="nonzero"/>
  </svg>
)

// NEW MIDJOURNEY ICON - Official Complex Design
const MidjourneyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" fillRule="evenodd">
    <path d="M22.369 17.676c-1.387 1.259-3.17 2.378-5.332 3.417.044.03.086.057.13.083l.018.01.019.012c.216.123.42.184.641.184.222 0 .426-.061.642-.184l.018-.011.019-.011c.14-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.304-.174.612-.266.949-.266.337 0 .645.092.949.266l.023.014c.188.109.334.219.602.442l.178.148c.221.184.346.278.483.36l.028.017.018.01c.21.12.407.181.62.185h.022a.31.31 0 110 .618c-.337 0-.645-.092-.95-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.02-.014a5.356 5.356 0 01-.49-.377l-.159-.132a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.641.184l-.02.011-.018.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.95.266c-.337 0-.644-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.026-.017a4.881 4.881 0 01-.425-.325.308.308 0 01-.12-.1l-.098-.081a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.642.184l-.018.011-.019.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.023.014-.022.014-.09.054A1.868 1.868 0 0112 22c-.337 0-.645-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.021-.014a5.356 5.356 0 01-.49-.377l-.158-.132a3.836 3.836 0 00-.483-.36l-.028-.017-.018-.01a1.256 1.256 0 00-.642-.185c-.221 0-.425.061-.641.184l-.019.011-.018.011c-.141.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.511.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.986.264c-.746-.09-1.319-.38-1.89-.866l-.035-.03c-.047-.041-.118-.106-.192-.174l-.196-.181-.107-.1-.011-.01a1.531 1.531 0 00-.336-.253.313.313 0 00-.095-.03h-.005c-.119.022-.238.059-.361.11a.308.308 0 01-.077.061l-.008.005a.309.309 0 01-.126.034 5.66 5.66 0 00-.774.518l-.416.324-.055.043a6.542 6.542 0 01-.324.236c-.305.207-.552.315-.8.315a.31.31 0 01-.01-.618h.01c.09 0 .235-.062.438-.198l.04-.027c.077-.054.163-.117.27-.199l.385-.301.06-.047c.268-.206.506-.373.73-.505l-.633-1.21a.309.309 0 01.254-.451l20.287-1.305a.309.309 0 01.228.537zm-1.118.14L2.369 19.03l.423.809c.128-.045.256-.078.388-.1a.31.31 0 01.052-.005c.132 0 .26.032.386.093.153.073.294.179.483.35l.016.015.092.086.144.134.097.089c.065.06.125.114.16.144.485.418.948.658 1.554.736h.011a1.25 1.25 0 00.6-.172l.021-.011.019-.011.018-.011c.141-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.305-.174.612-.266.95-.266.336 0 .644.092.948.266l.023.014c.188.109.335.219.603.442l.177.148c.222.184.346.278.484.36l.027.017.019.01c.215.124.42.185.641.185.222 0 .426-.061.641-.184l.019-.011.018-.011c.141-.084.267-.178.493-.366l.177-.148c.28-.232.427-.342.626-.456.304-.174.612-.266.949-.266.337 0 .644.092.949.266l.025.015c.187.109.334.22.603.443 1.867-.878 3.448-1.811 4.73-2.832l.02-.016zM3.653 2.026C6.073 3.06 8.69 4.941 10.8 7.258c2.46 2.7 4.109 5.828 4.637 9.149a.31.31 0 01-.421.335c-2.348-.945-4.54-1.258-6.59-1.02-1.739.2-3.337.792-4.816 1.703-.294.182-.62-.182-.405-.454 1.856-2.355 2.581-4.99 2.343-7.794-.195-2.292-1.031-4.61-2.284-6.709a.31.31 0 01.388-.442zM10.04 4.45c1.778.543 3.892 2.102 5.782 4.243 1.984 2.248 3.552 4.934 4.347 7.582a.31.31 0 01-.401.38l-.022-.01-.386-.154a10.594 10.594 0 00-.291-.112l-.016-.006c-.68-.247-1.199-.291-1.944-.101a.31.31 0 01-.375-.218C15.378 11.123 13.073 7.276 9.775 5c-.291-.201-.072-.653.266-.55zM4.273 2.996l.008.015c1.028 1.94 1.708 4.031 1.885 6.113.213 2.513-.31 4.906-1.673 7.092l-.02.031.003-.001c1.198-.581 2.47-.969 3.825-1.132l.055-.006c1.981-.23 4.083.029 6.309.837l.066.025-.007-.039c-.593-2.95-2.108-5.737-4.31-8.179l-.07-.078c-1.785-1.96-3.944-3.6-6.014-4.65l-.057-.028zm7.92 3.238l.048.048c2.237 2.295 3.885 5.431 4.974 9.191l.038.132.022-.004c.71-.133 1.284-.063 1.963.18l.027.01.066.024.046.018-.025-.073c-.811-2.307-2.208-4.62-3.936-6.594l-.058-.065c-1.02-1.155-2.103-2.132-3.15-2.856l-.015-.011z"/>
  </svg>
)

// PERPLEXITY ICON - POWIĘKSZONE DO ROZMIARU CHATGPT (24x24) - Tylko symbol bez tekstu
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

// AI Model Icon Mapping - Same as PromptCard
const getAIModelIcon = (model: string) => {
  const modelConfig = {
    'chatgpt': { 
      icon: ChatGPTIcon, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      name: 'ChatGPT'
    },
    'gpt-4': { 
      icon: GPT4Icon, 
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      name: 'GPT-4'
    },
    'claude': { 
      icon: ClaudeIcon, // NOWA OFICJALNA IKONA CLAUDE na szarym tle #585654 z kolorem #da7756
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gray-600/20',
      textColor: 'text-gray-400',
      name: 'Claude'
    },
    'dalle': { 
      icon: DALLEIcon, // NOWA OFICJALNA IKONA DALL-E z kolorowymi prostokątami
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
      name: 'DALL-E'
    },
    'midjourney': { 
      icon: MidjourneyIcon, // NOWA OFICJALNA IKONA MIDJOURNEY
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/20',
      textColor: 'text-pink-400',
      name: 'Midjourney'
    },
    'gemini': { 
      icon: GeminiIcon, // NOWA OFICJALNA IKONA GEMINI z gradientem
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      name: 'Gemini'
    },
    'perplexity': { 
      icon: PerplexityIcon, // POWIĘKSZONE LOGO PERPLEXITY (24x24) - Tylko symbol
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'bg-teal-500/20',
      textColor: 'text-teal-400',
      name: 'Perplexity'
    },
    'grok': { 
      icon: GrokIcon, // OFICJALNA IKONA GROK
      color: 'from-black to-gray-900',
      bgColor: 'bg-black/20',
      textColor: 'text-gray-300',
      name: 'Grok'
    },
    'other': { 
      icon: Bot, // PRZYWRÓCONA PIERWSZA IKONA OTHER AI - ROBOT
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-500/20',
      textColor: 'text-gray-400',
      name: 'Other AI'
    }
  }

  return modelConfig[model as keyof typeof modelConfig] || modelConfig.other
}

export function AddPromptForm({ isOpen, onClose, onSuccess }: AddPromptFormProps) {
  const { categories } = useCategories()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    category_id: '',
    primary_model: 'chatgpt',
    difficulty_level: 'beginner',
    author_name: '',
    tags: '',
    technique_explanation: '',
    example_output: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get current model configuration for dynamic icon
  const currentModelConfig = getAIModelIcon(formData.primary_model)
  const CurrentModelIcon = currentModelConfig.icon

  const aiModels = [
    { value: 'chatgpt', label: 'ChatGPT', description: 'Text generation and conversation' },
    { value: 'claude', label: 'Claude', description: 'Analysis and reasoning' },
    { value: 'dalle', label: 'DALL-E', description: 'Image generation' },
    { value: 'midjourney', label: 'Midjourney', description: 'Artistic image creation' },
    { value: 'gpt-4', label: 'GPT-4', description: 'Advanced reasoning and analysis' },
    { value: 'gemini', label: 'Gemini', description: 'Google\'s multimodal AI' },
    { value: 'perplexity', label: 'Perplexity', description: 'Research and fact-finding' },
    { value: 'grok', label: 'Grok', description: 'X\'s conversational AI' },
    { value: 'other', label: 'Other', description: 'Other AI models' }
  ]

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Easy to use and understand' },
    { value: 'intermediate', label: 'Intermediate', description: 'Requires some experience' },
    { value: 'advanced', label: 'Advanced', description: 'For experienced users' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('Title and content are required')
      }

      // Validate category selection
      if (!formData.category_id) {
        throw new Error('Please select a category')
      }

      console.log('📝 Submitting prompt with data:', {
        title: formData.title,
        category_id: formData.category_id,
        primary_model: formData.primary_model
      })

      // Insert the prompt
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          description: formData.description.trim() || null,
          category_id: formData.category_id, // Make sure this is set
          primary_model: formData.primary_model,
          difficulty_level: formData.difficulty_level,
          author_name: formData.author_name.trim() || 'Anonymous',
          technique_explanation: formData.technique_explanation.trim() || null,
          example_output: formData.example_output.trim() || null,
          compatible_models: [formData.primary_model],
          moderation_status: 'approved', // Auto-approve for demo
          total_likes: 0,
          total_dislikes: 0,
          total_uses: 0,
          quality_score: 0.0,
          is_verified: false,
          is_featured: false
        })
        .select()
        .single()

      if (promptError) {
        console.error('❌ Error inserting prompt:', promptError)
        throw promptError
      }

      console.log('✅ Prompt inserted successfully:', promptData)

      // ENHANCED TAG PROCESSING - Always add tags for better searchability
      const tagsToAdd = []
      
      // Add user-provided tags
      if (formData.tags.trim()) {
        const userTags = formData.tags
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 0)
        tagsToAdd.push(...userTags)
      }
      
      // AUTO-ADD SMART TAGS based on content and category
      const selectedCategory = categories.find(c => c.id === formData.category_id)
      if (selectedCategory) {
        // Add category name as tag
        tagsToAdd.push(selectedCategory.name.toLowerCase())
        
        // Add AI model as tag
        tagsToAdd.push(formData.primary_model)
        
        // Add difficulty as tag
        tagsToAdd.push(formData.difficulty_level)
        
        // Add smart tags based on content
        const content = formData.content.toLowerCase()
        const title = formData.title.toLowerCase()
        const description = formData.description.toLowerCase()
        const allText = `${title} ${description} ${content}`
        
        // Smart tag detection
        const smartTags = []
        if (allText.includes('email') || allText.includes('mail')) smartTags.push('email')
        if (allText.includes('social') || allText.includes('instagram') || allText.includes('linkedin')) smartTags.push('social-media')
        if (allText.includes('business') || allText.includes('professional')) smartTags.push('business')
        if (allText.includes('marketing') || allText.includes('campaign')) smartTags.push('marketing')
        if (allText.includes('code') || allText.includes('programming')) smartTags.push('coding')
        if (allText.includes('creative') || allText.includes('story')) smartTags.push('creative')
        if (allText.includes('analysis') || allText.includes('analyze')) smartTags.push('analysis')
        if (allText.includes('strategy') || allText.includes('strategic')) smartTags.push('strategy')
        if (allText.includes('content') || allText.includes('blog')) smartTags.push('content')
        if (allText.includes('sales') || allText.includes('selling')) smartTags.push('sales')
        
        tagsToAdd.push(...smartTags)
      }
      
      // Remove duplicates and empty tags
      const uniqueTags = [...new Set(tagsToAdd)].filter(tag => tag && tag.length > 0)
      
      console.log('🏷️ Adding tags:', uniqueTags)

      if (uniqueTags.length > 0 && promptData) {
        const tagInserts = uniqueTags.map(tag => ({
          prompt_id: promptData.id,
          tag: tag
        }))

        const { error: tagsError } = await supabase
          .from('prompt_tags')
          .insert(tagInserts)

        if (tagsError) {
          console.error('Error adding tags:', tagsError)
          // Don't fail the whole operation for tags
        } else {
          console.log('✅ Tags added successfully:', uniqueTags)
        }
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        description: '',
        category_id: '',
        primary_model: 'chatgpt',
        difficulty_level: 'beginner',
        author_name: '',
        tags: '',
        technique_explanation: '',
        example_output: ''
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error('❌ Error in handleSubmit:', err)
      setError(err instanceof Error ? err.message : 'Failed to add prompt')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header with Dynamic Official AI Model Icon */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {/* Dynamic Official AI Model Icon */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${currentModelConfig.color} flex items-center justify-center transition-all duration-300`}>
              <CurrentModelIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Add New Prompt</h2>
              <p className="text-sm text-gray-400">
                Share your amazing AI prompt for <span className={`font-medium ${currentModelConfig.textColor}`}>
                  {currentModelConfig.name}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Professional Email Writer"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Prompt Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your prompt here... Be specific and clear about what you want the AI to do."
                  rows={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400 resize-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Briefly describe what this prompt does and when to use it..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* AI Model and Category Row */}
              <div className="grid grid-cols-1 gap-4">
                {/* Primary AI Model - Enhanced with Official Icons */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Primary AI Model <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.primary_model}
                    onChange={(e) => handleChange('primary_model', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white"
                  >
                    {aiModels.map(model => {
                      return (
                        <option key={model.value} value={model.value} className="bg-slate-800">
                          {model.label} - {model.description}
                        </option>
                      )
                    })}
                  </select>
                  {/* Model Preview with Official Icon */}
                  <div className={`mt-2 flex items-center space-x-2 px-3 py-2 ${currentModelConfig.bgColor} rounded-lg`}>
                    <CurrentModelIcon className={`h-4 w-4 ${currentModelConfig.textColor}`} />
                    <span className={`text-sm font-medium ${currentModelConfig.textColor}`}>
                      Selected: {currentModelConfig.name}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => handleChange('category_id', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white"
                    required
                  >
                    <option value="" className="bg-slate-800">Select a category *</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="bg-slate-800">
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formData.category_id && (
                    <p className="text-xs text-green-400 mt-1">
                      ✓ Selected: {categories.find(c => c.id === formData.category_id)?.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Difficulty and Author Row */}
              <div className="grid grid-cols-1 gap-4">
                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => handleChange('difficulty_level', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-colors text-white"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level.value} value={level.value} className="bg-slate-800">
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => handleChange('author_name', e.target.value)}
                    placeholder="Anonymous"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags (Optional - Smart tags will be added automatically)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  placeholder="e.g., business, email, professional (comma separated)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400"
                />
              </div>

              {/* Technique Explanation */}
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Why This Works (Optional)
                </label>
                <textarea
                  value={formData.technique_explanation}
                  onChange={(e) => handleChange('technique_explanation', e.target.value)}
                  placeholder="Explain the techniques or principles that make this prompt effective..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400 resize-none"
                />
              </div>

              {/* Example Output */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Example Output (Optional)
                </label>
                <textarea
                  value={formData.example_output}
                  onChange={(e) => handleChange('example_output', e.target.value)}
                  placeholder="Show an example of what this prompt produces..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-white placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${currentModelConfig.color} hover:opacity-90 rounded-lg font-medium transition-opacity text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save className="h-4 w-4" />
              <span>{submitting ? 'Adding...' : `Add ${currentModelConfig.name} Prompt`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}