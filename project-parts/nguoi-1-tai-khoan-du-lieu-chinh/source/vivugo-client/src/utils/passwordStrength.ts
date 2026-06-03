export type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong'

export type PasswordStrengthResult = {
  score: number
  level: PasswordStrengthLevel
  label: string
  helperText: string
}

export function getPasswordStrength(password = ''): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      level: 'empty',
      label: 'Chưa nhập mật khẩu',
      helperText: 'Mật khẩu cần tối thiểu 8 ký tự.'
    }
  }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score >= 5) {
    return {
      score,
      level: 'strong',
      label: 'Mật khẩu mạnh',
      helperText: 'Mật khẩu tốt: có chữ hoa, chữ thường, số và ký tự đặc biệt.'
    }
  }

  if (score >= 3) {
    return {
      score,
      level: 'medium',
      label: 'Mật khẩu trung bình',
      helperText: 'Nên thêm chữ hoa, chữ thường, số và ký tự đặc biệt để mạnh hơn.'
    }
  }

  return {
    score,
    level: 'weak',
    label: 'Mật khẩu yếu',
    helperText: 'Nên dùng ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
  }
}
