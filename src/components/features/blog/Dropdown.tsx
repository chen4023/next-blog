import { FilterMenu } from '@/types/blog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MenusProps {
  menus: FilterMenu[];
}

export default function Dropdown({ menus }: MenusProps) {
  return (
    <Select defaultValue="latest">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="정렬 방식 선택" />
      </SelectTrigger>
      <SelectContent>
        {menus.map((menu) => (
          <SelectItem key={menu.title} value={menu.value}>
            {menu.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
