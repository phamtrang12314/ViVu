import { getPasswordStrength } from '../../utils/passwordStrength'

type Props = {
  password?: string
}

const levelClass = {
  empty: 'bg-gray-200 text-gray-500',
  weak: 'bg-red-500 text-red-600',
  medium: 'bg-amber-500 text-amber-600',
  strong: 'bg-emerald-500 text-emerald-600'
}

export default function PasswordStrengthMeter({ password = '' }: Props) {
  const strength = getPasswordStrength(password)
  const activeBars = strength.level === 'empty' ? 0 : Math.max(1, Math.min(3, strength.score - 1))

  return (
    <div className="mt-2 space-y-1">
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-colors ${
              index < activeBars ? levelClass[strength.level].split(' ')[0] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${levelClass[strength.level].split(' ')[1]}`}>
        {strength.label}
      </p>
      <p className="text-xs leading-relaxed text-gray-500">{strength.helperText}</p>
    </div>
  )
}
