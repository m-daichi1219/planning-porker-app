import type { InjectionKey } from 'vue'
import type { UseCreateRoomType } from '@/composables/room/useCreateRoom'

export const createRoomKey: InjectionKey<UseCreateRoomType> = Symbol('useCreateRoom')
