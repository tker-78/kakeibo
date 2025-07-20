export const getMonthRange =  (date: string | Date) => {
  // 引数がstringの場合、Dateオブジェクトに変換する
  const dateObject = typeof date === 'string' ? new Date(date) : date
  const start = new Date(dateObject.getFullYear(), dateObject.getMonth(), 2).toISOString().split('T')[0]
  const end = new Date(dateObject.getFullYear(), dateObject.getMonth()+1, 1).toISOString().split('T')[0]
  return {
    start,
    end,
  }
 }
