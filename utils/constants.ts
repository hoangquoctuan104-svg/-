import { IntelItem } from '../types';

export const INTEL_DATA: IntelItem[] = [
  {
    id: '1',
    title: '2024 美国站 FBA 入库配置费生效',
    date: '2024-03-01',
    summary: '亚马逊引入了新的入库配置服务费，适用于标准尺寸和大件尺寸产品，旨在将库存更高效地分配至多个运营中心。卖家可选择拆分货件以减少或免除该费用。',
    link: 'https://sellercentral.amazon.com/help/hub/reference/external/GC3Q44D73448WBV9'
  },
  {
    id: '2',
    title: '欧盟通用产品安全法规 (GPSR) 预警',
    date: '2024-12-13',
    summary: 'GPSR 将于 2024 年 12 月 13 日正式适用。所有在欧盟销售的非食品类商品必须符合严格的标签和可追溯性要求，并指定欧盟负责人。',
    link: 'https://sellercentral-europe.amazon.com/help/hub/reference/external/GQAYN3Q9U9G4D8Z9'
  },
  {
    id: '3',
    title: '低库存水平费用更新',
    date: '2024-04-01',
    summary: '针对库存水平相对于客户需求持续偏低的标准尺寸产品，亚马逊将收取低库存水平费。建议卖家维持健康的库存周转天数以避免此费用。',
    link: 'https://sellercentral.amazon.com/help/hub/reference/external/GV43F6S76Y9DCYN7'
  },
  {
    id: '4',
    title: 'FBA 退货期限调整',
    date: '2024-05-15',
    summary: '亚马逊更新了部分品类（包括电子产品）的退货窗口期，缩短了自动授权期限，旨在减少滥用退货并保护卖家利益。',
    link: 'https://sellercentral.amazon.com/gp/help/external/200379860'
  },
  {
    id: '5',
    title: '美国站服装尺码标准化要求',
    date: '2024-06-30',
    summary: '为改善买家体验并减少因合身问题导致的退货，亚马逊推出了新的服装尺码输入要求。不符合规范的 ASIN 可能会被抑制显示。',
    link: 'https://sellercentral.amazon.com/help/hub/reference/external/G201648210'
  }
];

export const BANNED_WORDS = [
  'Cure', 
  'Anti-bacterial', 
  'Free Shipping', 
  'Best Seller',
  'Cancer free',
  'FDA Approved',
  '治疗',
  '抗菌',
  '包邮',
  '最畅销',
  '抗癌'
];