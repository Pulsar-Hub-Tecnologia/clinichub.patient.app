import { Label } from '@/components/ui/label';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User } from '@/types/User';
// import { SelectInput } from '@/components/select-input/select-input';

interface FormUserProps {
  data: User;
  change: (value: string, item: string) => void;
}

function FormUser({ data, change }: FormUserProps) {
  // Role selection removed - patient app has single role only
  return (
    <CardContent className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input
          type="text"
          id="name"
          required
          value={data.name}
          placeholder="Nome do usuário"
          onChange={(e) => change(e.target.value, 'name')}
        />
      </div>

      {/* Role selection removed - patient app has single role only */}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="E-mail do usuário"
          value={data.email}
          onChange={(e) => change(e.target.value, 'email')}
        />
      </div>
    </CardContent>
  );
}

export default FormUser;
