import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param date - 포맷팅할 날짜 (Date 객체 또는 날짜 문자열)
 * @param formatStr - 포맷 문자열 (기본값: 'PPP')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | string | undefined, formatStr: string = 'PPP'): string {
  if (!date) return '미상';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: ko });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '미상';
  }
}

/**
 * 날짜를 간단한 형식으로 포맷팅 (예: 2024년 3월 15일)
 */
export function formatDateSimple(date: Date | string | undefined): string {
  return formatDate(date, 'PPP');
}

/**
 * 날짜를 상세한 형식으로 포맷팅 (예: 2024년 3월 15일 금요일)
 */
export function formatDateDetailed(date: Date | string | undefined): string {
  return formatDate(date, 'PPPP');
}

/**
 * 날짜를 시간 포함 형식으로 포맷팅 (예: 2024년 3월 15일 오후 2:30)
 */
export function formatDateTime(date: Date | string | undefined): string {
  return formatDate(date, 'PPP p');
}

/**
 * 상대적 시간 표시 (예: 3일 전, 1주일 전)
 */
export function formatRelativeTime(date: Date | string | undefined): string {
  if (!date) return '미상';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return '오늘';
    if (diffInDays === 1) return '어제';
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;

    return `${Math.floor(diffInDays / 365)}년 전`;
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '미상';
  }
}
