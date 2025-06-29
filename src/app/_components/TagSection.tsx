import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { mockType } from '@/mock/blog';
import Link from 'next/link';

export default function TagSection() {
  return (
    <aside>
      <Card>
        <CardHeader>
          <CardTitle>태그 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {mockType.map((tag) => (
              <Link href={`?tag=${tag.name}`} key={tag.name}>
                <div className="flex justify-between hover:bg-primary/10 text-muted-foreground items-center p-1 px-2">
                  <span>{tag.name}</span>
                  <span>{tag.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
