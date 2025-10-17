import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Check, ImageIcon, Folder, Image, Upload } from 'lucide-react';
import BasicInput from '@/components/basic-input/basic-input';
import { Switch } from '@/components/ui/switch';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useLoading } from '@/context/loading-context';
import AccountService, { AccountData } from '@/services/api/account.service';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { formatPhone } from '@/utils/formats';
import { CameraModal } from '@/components/modal/camera/camera';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const defaultAccountData: AccountData = {
  id: "",
  name: "",
  email: "",
  phone: "",
  cpf: "",
  regional_council_number: "",
  picture: undefined,
  especiality: "",
  date_birth: "",
  bio: "",
  has_reset_pass: false,
  has_verified_email: false,
  password_hash: "",
  reset_password_expires: undefined,
  token_reset_password: undefined,
  created_at: "",
  updated_at: undefined,
  deleted_at: undefined,
}

export default function Account() {
  const { onLoading, offLoading } = useLoading()
  const { workspace } = useAuth()
  const { theme, setTheme } = useTheme()

  const [accountData, setAccountData] = useState<AccountData>(defaultAccountData)
  const [hasChanged, setHasChanged] = useState<boolean>(false)
  const [isHybrid, setIsHibryd] = useState<boolean>(workspace?.role === "HYBRID" || workspace?.type === "PERSONAL")


  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    (async () => {
      try {
        onLoading()
        const responseAccout = await AccountService.getAccount()
        setAccountData(responseAccout)
        setPreview(responseAccout.picture || null)
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.message)
        }

        toast.error("Ops! Tivemos um erro interno!")
      } finally {
        offLoading()
      }
    })()
  }, [])

  const handleSaveData = async () => {
    try {
      onLoading()
      const updateAccount = await AccountService.updateAccount(accountData)
      toast.success(updateAccount.message)
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.message || "Ops! Tivemos um erro ao atualizar seus dados!")
      }
      toast.error("Ops! Tivemos um erro ao atualizar seus dados!")
    } finally {
      setHasChanged(false)
      offLoading()
    }
  }

  const handleChangeData = <T extends keyof AccountData>(field: T, value: AccountData[T] | boolean) => {
    setHasChanged(true)
    return setAccountData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const uploadFile = async (file: File) => {
    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const uploadedFile = await AccountService.updatePicture(base64Image);

      if (uploadedFile.status !== 200) {
        return toast.error(uploadedFile.message);
      }

      toast.success(uploadedFile.message);
      return uploadedFile;
    } catch (error) {
      toast.error("Ops! Tivemos um erro ao enviar a imagem!");
      return null;
    }
  };

  const handleFileSelected = async (file: File) => {
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const fileKey = await uploadFile(file);

    if (!fileKey) {
      setPreview(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelected(file);
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Minha Conta</h1>
            <p className="text-sm text-gray-500">Gerencie suas informações pessoais e preferências</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={'default'} className="flex items-center gap-1" disabled={!hasChanged} onClick={handleSaveData}>
            {hasChanged ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            <span className='hidden md:inline'>{hasChanged ? "Salvar Alterações" : "Dados Atualizados"}</span>
          </Button>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Informações Pessoais</CardTitle>
              {workspace?.type === "BUSINESS" && workspace.role !== "PROFESSIONAL" && (
                <div className='flex items-center gap-2'>
                  <p>Sou profissional</p>
                  <Switch checked={isHybrid} onCheckedChange={(checked) => setIsHibryd(checked)} />
                </div>
              )}
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <BasicInput
                label="Nome Completo"
                placeholder="Digite seu Nome Completo"
                id="clininName"
                type="text"
                value={accountData.name}
                onChange={(e) => handleChangeData("name", e.target.value)}
              />
              <BasicInput
                label="E-mail"
                placeholder="Digite o seu Email"
                id="email"
                type="email"
                value={accountData.email}
                onChange={(e) => handleChangeData("email", e.target.value)}
              />
              <BasicInput
                label="Telefone"
                placeholder="Digite o seu Telefone"
                id="phone"
                type="tel"
                value={formatPhone(accountData.phone)}
                maxLength={15}
                onChange={(e) => handleChangeData("phone", e.target.value)}
              />
              <BasicInput
                label="Data de Nascimento"
                placeholder="Digite o sua Data de Nascimento"
                id="dateBirth"
                type="date"
                value={accountData.date_birth}
                onChange={(e) => handleChangeData("date_birth", e.target.value)}
              />
              <div className={cn("col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-in-out overflow-hidden", isHybrid ? 'h-auto opacity-100' : 'h-0 opacity-0')}>
                <BasicInput
                  label="Número do Conselho Regional"
                  placeholder="Digite o Número do Conselho Regional"
                  id="crm"
                  type="text"
                  maxLength={13}
                  value={accountData.regional_council_number}
                  onChange={(e) => handleChangeData("regional_council_number", e.target.value)}
                />
                <BasicInput
                  label="Especialidade"
                  placeholder="Digite o sua Especialidade"
                  id="especiality"
                  type="text"
                  value={accountData.especiality}
                  onChange={(e) => handleChangeData("especiality", e.target.value)}
                />
                <BasicInput
                  className="h-20"
                  label="Bio Profissional"
                  placeholder="Digite o sua Bio Prossional"
                  id="bio"
                  value={accountData.bio}
                  useTextArea={true}
                  onChange={(e) => handleChangeData("bio", e.target.value)}
                />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Preferências do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <div className='flex items-center justify-between w-full'>
                <div>
                  <h2>Tema Escuro</h2>
                  <p className="text-sm text-gray-500">Ativar modo escuro na interface</p>
                </div>
                <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              </div>
            </CardContent>
          </Card>
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Segurança da Conta</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">

            </CardContent>
          </Card> */}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
              <div
                className="w-32 h-32 bg-light-gray rounded-full flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview da foto do aluno"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AspectRatio ratio={16 / 9} className='flex items-center justify-center'>
                    <Image className='h-10 w-10' />
                  </AspectRatio>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mb-2 flex items-center gap-1">
                    <Upload className="h-4 w-4" />
                    Enviar Logo
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <CameraModal onCapture={handleFileSelected}>
                    <DropdownMenuItem>
                      <ImageIcon />
                      Câmera
                    </DropdownMenuItem>
                  </CameraModal>
                  <DropdownMenuItem onClick={handleGalleryClick}>
                    <Folder />
                    Galeria
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
