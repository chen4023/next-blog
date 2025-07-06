import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getTagStats } from '@/lib/notion';
import Link from 'next/link';
import { Hash } from 'lucide-react';

interface TagSectionProps {
  currentTag?: string;
}

export default async function TagSection({ currentTag }: TagSectionProps) {
  const tagStats = await getTagStats();

  return (
    <aside>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm gap-3">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Hash className="h-3 w-3 text-primary" />
            태그 목록
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-0.5">
            {tagStats.map((tag) => {
              const isActive = tag.name === '전체' ? !currentTag : currentTag === tag.name;

              return (
                <Link
                  href={tag.name === '전체' ? '/' : `/?tag=${encodeURIComponent(tag.name)}`}
                  key={tag.id}
                  className="group"
                >
                  <div
                    className={`flex justify-between items-center px-2 py-1.5 rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground group-hover:translate-x-1'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-primary-foreground' : 'text-foreground'
                      }`}
                    >
                      {tag.name}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {tag.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {tagStats.length > 1 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                총 {tagStats[0]?.count || 0}개의 포스트
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
