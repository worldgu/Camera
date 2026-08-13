import { useState, useRef, useEffect, useMemo } from 'react';

interface Work {
  id: number;
  slug: string;
  title: string;
  category: string;
  project: string;
  date: string;
  location: string;
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  focalLength: string;
  description: string;
  color: string;
  aspectRatio: number;
}

interface Props {
  works: Work[];
  base: string;
}

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'portrait', label: '人像' },
  { key: 'landscape', label: '风光' },
  { key: 'street', label: '街拍' },
  { key: 'still', label: '静物' },
  { key: 'other', label: '其他' },
];

const FILTER_TABS = [
  { key: 'category', label: '题材' },
  { key: 'project', label: '项目' },
  { key: 'date', label: '时间' },
];

const VIEW_MODES = [
  { key: 'masonry', label: '瀑布流' },
  { key: 'album', label: '相册' },
];

export default function WorksGallery({ works, base }: Props) {
  const [viewMode, setViewMode] = useState<'masonry' | 'album'>('masonry');
  const [filterType, setFilterType] = useState<'category' | 'project' | 'date'>('category');
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 按项目分组（相册视图用）
  const projects = useMemo(() => {
    const map = new Map<string, Work[]>();
    works.forEach((w) => {
      if (!map.has(w.project)) map.set(w.project, []);
      map.get(w.project)!.push(w);
    });
    return Array.from(map.entries());
  }, [works]);

  // 筛选后的作品列表
  const filteredWorks = useMemo(() => {
    let result = [...works];

    if (filterType === 'category' && activeFilter !== 'all') {
      result = result.filter((w) => w.category === activeFilter);
    } else if (filterType === 'project' && activeFilter !== 'all') {
      result = result.filter((w) => w.project === activeFilter);
    } else if (filterType === 'date') {
      // 时间视图下按年份分组
      if (activeFilter !== 'all') {
        result = result.filter((w) => w.date.startsWith(activeFilter));
      }
    }

    // 按日期从新到旧排序
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
  }, [works, filterType, activeFilter]);

  // 灯箱显示的作品列表（当前筛选后的）
  const lightboxWorks = filteredWorks;

  // 年份列表
  const years = useMemo(() => {
    const set = new Set(works.map((w) => w.date.slice(0, 4)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [works]);

  // 项目列表
  const projectNames = useMemo(() => {
    const set = new Set(works.map((w) => w.project));
    return Array.from(set);
  }, [works]);

  // 筛选选项列表
  const filterOptions = useMemo(() => {
    if (filterType === 'category') return CATEGORIES;
    if (filterType === 'project') {
      return [{ key: 'all', label: '全部项目' }, ...projectNames.map((p) => ({ key: p, label: p }))];
    }
    return [{ key: 'all', label: '全部年份' }, ...years.map((y) => ({ key: y, label: y }))];
  }, [filterType, projectNames, years]);

  // 无限滚动
  useEffect(() => {
    if (viewMode !== 'masonry') return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredWorks.length) {
          setVisibleCount((prev) => Math.min(prev + 4, filteredWorks.length));
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredWorks.length, viewMode]);

  // 筛选变化时重置可见数量
  useEffect(() => {
    setVisibleCount(8);
  }, [activeFilter, filterType]);

  // 灯箱键盘导航
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % lightboxWorks.length : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + lightboxWorks.length) % lightboxWorks.length : null
        );
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxIndex, lightboxWorks.length]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const currentWork = lightboxIndex !== null ? lightboxWorks[lightboxIndex] : null;

  const visibleWorks = viewMode === 'masonry' ? filteredWorks.slice(0, visibleCount) : filteredWorks;

  return (
    <div className="works-gallery">
      {/* 工具栏 */}
      <div className="works-toolbar">
        <div className="works-toolbar__left">
          {/* 浏览模式切换 */}
          <div className="segmented">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.key}
                className={`segmented__btn ${viewMode === mode.key ? 'is-active' : ''}`}
                onClick={() => setViewMode(mode.key as 'masonry' | 'album')}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
        <div className="works-toolbar__right">
          {/* 筛选维度切换 */}
          <div className="segmented">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`segmented__btn ${filterType === tab.key ? 'is-active' : ''}`}
                onClick={() => {
                  setFilterType(tab.key as 'category' | 'project' | 'date');
                  setActiveFilter('all');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 筛选标签（仅瀑布流显示） */}
      {viewMode === 'masonry' && (
        <div className="filter-chips">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              className={`filter-chip ${activeFilter === opt.key ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* 瀑布流视图 */}
      {viewMode === 'masonry' && (
        <>
          <div className="masonry">
            {visibleWorks.map((work, index) => (
              <div
                key={work.id}
                className="masonry__item"
                onClick={() => openLightbox(filteredWorks.indexOf(work))}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="masonry__img"
                  style={{
                    background: work.color,
                    aspectRatio: `${work.aspectRatio}`,
                  }}
                >
                  <span className="masonry__title">{work.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 无限滚动哨兵 */}
          {visibleCount < filteredWorks.length && (
            <div ref={sentinelRef} className="load-more">
              <div className="load-more__spinner"></div>
            </div>
          )}

          {filteredWorks.length === 0 && (
            <div className="works-empty">该分类下暂无作品</div>
          )}
        </>
      )}

      {/* 相册视图 */}
      {viewMode === 'album' && (
        <div className="albums">
          {projects.map(([projectName, projectWorks]) => {
            const filtered = projectWorks.filter((w) => {
              if (filterType === 'category' && activeFilter !== 'all') return w.category === activeFilter;
              if (filterType === 'date' && activeFilter !== 'all') return w.date.startsWith(activeFilter);
              return true;
            });
            if (filtered.length === 0) return null;

            return (
              <div key={projectName} className="album">
                <h3 className="album__title">{projectName}</h3>
                <p className="album__count">{filtered.length} 张</p>
                <div className="album__grid">
                  {filtered.slice(0, 4).map((work) => (
                    <div
                      key={work.id}
                      className="album__item"
                      onClick={() => openLightbox(filteredWorks.indexOf(work))}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="album__img"
                        style={{
                          background: work.color,
                          aspectRatio: '1 / 1',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 灯箱 */}
      {currentWork && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox__close" onClick={closeLightbox} aria-label="关闭">
            ×
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null ? (prev - 1 + lightboxWorks.length) % lightboxWorks.length : null
              );
            }}
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) =>
                prev !== null ? (prev + 1) % lightboxWorks.length : null
              );
            }}
            aria-label="下一张"
          >
            ›
          </button>

          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <div
              className="lightbox__image"
              style={{ background: currentWork.color }}
            >
              <span className="lightbox__image-title">{currentWork.title}</span>
            </div>
            <div className="lightbox__info">
              <h3 className="lightbox__title">{currentWork.title}</h3>
              <p className="lightbox__desc">{currentWork.description}</p>
              <div className="lightbox__meta">
                <div className="lightbox__meta-row">
                  <span>相机</span><span>{currentWork.camera}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>镜头</span><span>{currentWork.lens}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>光圈</span><span>{currentWork.aperture}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>快门</span><span>{currentWork.shutter}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>ISO</span><span>{currentWork.iso}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>焦距</span><span>{currentWork.focalLength}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>地点</span><span>{currentWork.location}</span>
                </div>
                <div className="lightbox__meta-row">
                  <span>时间</span><span>{currentWork.date}</span>
                </div>
              </div>
              <a
                href={`${base}/works/${currentWork.slug}/`}
                className="lightbox__detail-link"
              >
                查看详情 →
              </a>
            </div>
          </div>

          <div className="lightbox__counter">
            {(lightboxIndex ?? 0) + 1} / {lightboxWorks.length}
          </div>
        </div>
      )}
    </div>
  );
}
