import { getPostMarketOverview } from '../../utils/postMarket'
import { db } from '../../utils/db'
import type { PostMarketOverview } from '#shared/types/post-market'

export default defineEventHandler((): PostMarketOverview => getPostMarketOverview(db))
