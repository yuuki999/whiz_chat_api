import { supabase } from "supabase/supabase"

export const messageService = {
  async createMessage(userId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: userId, content })
      .select()
    if (error) throw error
    return data[0]
  },

  subscribeToNewMessages(callback: (payload: any) => void) {
    return supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        callback
      )
      .subscribe()
  }
}
