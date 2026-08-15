export interface GearItem {
  id: string;
  slug: string;
  name: string;
  model: string;
  type: string;
  subtype: string;
  status: string;
  acquiredAt?: string;
  color: string;
  review: string;
  specs: { label: string; value: string }[];
  matchCamera?: string;
  matchLens?: string;
}

interface WorkLike {
  camera: string;
  lens: string;
}

/** 大类中文名，与需求文档的七大分类体系一致 */
export const GEAR_TYPE_LABELS: Record<string, string> = {
  camera: '相机',
  lens: '镜头',
  support: '稳定',
  light: '灯光',
  filter: '滤镜',
  storage: '存储与供电',
  bag: '包与其他',
};

export const GEAR_STATUS_LABELS: Record<string, string> = {
  active: '在用',
  retired: '曾用',
  wishlist: '愿望',
};

/**
 * 器材与作品的关联：机身按 works.camera 匹配，镜头按 works.lens 匹配。
 * 没有 matchCamera / matchLens 的配件类器材不关联作品。
 */
export function worksForGear<T extends WorkLike>(item: GearItem, works: T[]): T[] {
  if (item.matchCamera) {
    return works.filter((w) => w.camera === item.matchCamera);
  }
  if (item.matchLens) {
    return works.filter((w) => w.lens === item.matchLens);
  }
  return [];
}

export function countWorksForGear<T extends WorkLike>(item: GearItem, works: T[]): number {
  return worksForGear(item, works).length;
}
