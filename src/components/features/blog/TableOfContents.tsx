'use client';

import { Badge } from '@/components/ui/badge';
import { formatDateSimple } from '@/lib/utils';
import { type TableOfContentsItem } from '@/lib/utils';
import { type Post } from '@/types/blog';

interface TableOfContentsProps {
  tableOfContents: TableOfContentsItem[];
  post: Post;
}

export function TableOfContents({ tableOfContents, post }: TableOfContentsProps) {
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    const element = document.getElementById(id);
    if (element) {
      // scroll-mt-20 클래스가 적용되어 있으므로 추가 오프셋은 필요 없음
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (tableOfContents.length > 0) {
    return (
      <div className="bg-muted/30 space-y-4 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold">목차</h3>
        <nav className="space-y-2">
          {tableOfContents.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={`#${item.id}`}
              onClick={(e) => handleTocClick(e, item.id)}
              className={`block text-sm hover:text-foreground transition-colors cursor-pointer ${
                item.level === 1 ? 'font-medium' : 'text-muted-foreground'
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold">포스트 정보</h3>
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-muted-foreground">작성자:</span>
          <p className="font-medium">{post.author || '미상'}</p>
        </div>
        <div>
          <span className="text-muted-foreground">작성일:</span>
          <p className="font-medium">{formatDateSimple(post.date)}</p>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div>
            <span className="text-muted-foreground">태그:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
