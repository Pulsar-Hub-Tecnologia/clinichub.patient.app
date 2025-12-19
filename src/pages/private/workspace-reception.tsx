import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MapPin,
  Clock,
  Mail,
  Star,
  Users,
  Calendar,
  Award,
  Building,
  CheckCircle2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PatientService from "@/services/api/patient.service";

export default function WorkspaceReceptionPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("plans");
  const [plansPage, setPlansPage] = useState(1);
  const [servicesPage, setServicesPage] = useState(1);
  const PLANS_PER_PAGE = 3;
  const SERVICES_PER_PAGE = 3;

  const { data: workspace, isLoading } = useQuery({
    queryKey: ["workspace-reception", workspaceId],
    queryFn: () => PatientService.getWorkspaceById(workspaceId!),
    enabled: !!workspaceId,
  });

  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["workspace-plans", workspaceId, plansPage],
    queryFn: () => PatientService.getWorkspacePlans(workspaceId!, plansPage, PLANS_PER_PAGE),
    enabled: !!workspaceId,
  });

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["workspace-services", workspaceId, servicesPage],
    queryFn: () => PatientService.getWorkspaceServices(workspaceId!, servicesPage, SERVICES_PER_PAGE),
    enabled: !!workspaceId,
  });

  const handleScheduleConsultation = () => {
    navigate("/consultations", { state: { tab: "schedule", workspaceId } });
  };

  const handleCheckout = (item: any, type: 'plan' | 'service') => {
    navigate("/checkout", { state: { item, type, workspace } });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Clínica não encontrada</p>
      </div>
    );
  }

  const stats = [
    { label: "Anos de Experiência", value: "15+", icon: Award },
    { label: "Profissionais", value: "35", icon: Users },
    { label: "Especialidades", value: "12", icon: Building },
    { label: "Pacientes Ativos", value: "2.8k+", icon: Users },
  ];

  const getPlanColorStyles = (index: number) => {
    const styles = [
      {
        bg: "bg-blue-50",
        border: "border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
        price: "text-blue-600",
        text: "text-blue-600",
      },
      {
        bg: "bg-purple-50",
        border: "border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
        price: "text-purple-600",
        text: "text-purple-600",
      },
      {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        button: "bg-yellow-600 hover:bg-yellow-700",
        price: "text-yellow-600",
        text: "text-yellow-800",
      },
    ];
    return styles[index % styles.length];
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const calculateTotalPrice = (plan: any): number => {
    if (!plan.steps || plan.steps.length === 0) return 0;
    return plan.steps.reduce((total: number, step: any) => {
      const price = step.service?.price || 0;
      return total + price * step.quantity;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <section
        className="relative h-64 bg-gradient-to-r from-purple-600 to-purple-800 text-white"
        style={{
          backgroundImage: workspace.cover_picture
            ? `url('${workspace.cover_picture}')`
            : "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-600/90"></div>
        <div className="container relative z-10 mx-auto px-6 py-12 max-w-7xl">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo à {workspace.workspace_name}</h1>
          <p className="text-lg mb-6 max-w-2xl">
            Excelência em atendimento médico com tecnologia de ponta e equipe especializada.
            Cuidando da sua saúde com carinho e profissionalismo.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={handleScheduleConsultation}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Agendar Consulta
            </Button>
            <Button size="lg" className="border-white text-white hover:bg-white/10">
              <MessageCircle className="mr-2 h-5 w-5" />
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                {workspace.workspace_picture ? (
                  <img
                    src={workspace.workspace_picture}
                    alt={workspace.workspace_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{workspace.workspace_name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">5.0</span>
                  <span className="text-sm text-gray-500">• 2.847 pacientes atendidos</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Contato</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {workspace.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span>{workspace.phone}</span>
                    </div>
                  )}
                  {workspace.whatsapp && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-600" />
                      <span>{workspace.whatsapp}</span>
                    </div>
                  )}
                  {workspace.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="text-xs break-all">{workspace.email}</span>
                    </div>
                  )}
                  {!workspace.phone && !workspace.whatsapp && !workspace.email && (
                    <p className="text-gray-500">Informações de contato não disponíveis</p>
                  )}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Localização</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {workspace.address ? (
                    <>
                      <p>{workspace.address.street}{workspace.address.number ? `, ${workspace.address.number}` : ''}</p>
                      <p>{workspace.address.neighborhood}, {workspace.address.city} – {workspace.address.state.acronym}</p>
                      <p>CEP: {workspace.address.cep}</p>
                      <Button variant="link" className="p-0 h-auto text-purple-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        Ver no mapa
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500">Endereço não disponível</p>
                  )}
                </div>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Horário de Funcionamento</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Segunda a Sexta:</span>
                    <span className="font-medium">7h às 19h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span className="font-medium">8h às 14h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span className="font-medium text-red-600">Fechado</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">i</span>
                </div>
                <h3 className="text-xl font-bold">
                  {workspace.workspace_type === "PERSONAL" ? "Sobre o Profissional" : "Sobre a Clínica"}
                </h3>
              </div>

              {workspace.description ? (
                <p className="text-gray-700 mb-6 leading-relaxed">{workspace.description}</p>
              ) : workspace.workspace_type === "PERSONAL" && workspace.owner?.bio ? (
                <p className="text-gray-700 mb-6 leading-relaxed">{workspace.owner.bio}</p>
              ) : (
                <p className="text-gray-500 mb-6 leading-relaxed">Informações sobre a clínica não disponíveis.</p>
              )}

              {workspace.workspace_type === "PERSONAL" && workspace.owner && (
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                      {workspace.owner.picture ? (
                        <img src={workspace.owner.picture} alt={workspace.owner.name} className="w-full h-full object-cover" />
                      ) : (
                        workspace.owner.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{workspace.owner.name}</h4>
                      {workspace.owner.especiality && (
                        <p className="text-purple-600 font-medium">{workspace.owner.especiality}</p>
                      )}
                      {workspace.owner.regional_council_number && (
                        <p className="text-sm text-gray-600 mt-1">
                          CRM: {workspace.owner.regional_council_number}
                        </p>
                      )}
                      {workspace.owner.phone && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{workspace.owner.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <Icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-purple-600 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-auto items-center justify-start w-full bg-transparent p-0 mb-6 gap-4">
            <TabsTrigger
              value="plans"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gray-100 text-gray-600 px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Award className="mr-2 h-4 w-4" />
              Planos e protocolos
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-gray-100 text-gray-600 px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Building className="mr-2 h-4 w-4" />
              Serviços Avulsos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-6 w-6 text-purple-600" />
                      <h2 className="text-2xl font-bold">Planos e Protocolos Disponíveis</h2>
                    </div>
                    <p className="text-gray-600">Escolha o ideal para suas necessidades</p>
                  </div>

                  {isLoadingPlans ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : !plansData?.data || plansData.data.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Nenhum plano ou protocolo disponível no momento.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {plansData.data.map((plan: any, index: number) => {
                          const styles = getPlanColorStyles(index);
                          const totalPrice = calculateTotalPrice(plan);

                          return (
                            <Card
                              key={plan.id}
                              className={`border-2 ${styles.bg} ${styles.border}`}
                            >
                              <CardContent className="p-6 flex flex-col h-full">
                                <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                                <div className="mb-6">
                                  <span className={`text-3xl font-bold ${styles.price}`}>
                                    {formatPrice(totalPrice)}
                                  </span>
                                  {plan.expires_in_unit && (
                                    <span className="text-gray-600 ml-2 text-sm">
                                      / {plan.expires_in_value} {plan.expires_in_unit === "MONTH" ? "mês" : plan.expires_in_unit === "YEAR" ? "ano" : plan.expires_in_unit === "WEEK" ? "semana" : "dia"}
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1">
                                  <ul className="space-y-3 mb-6">
                                    {plan.steps?.map((step: any, i: number) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${styles.text}`} />
                                        <span>
                                          {step.quantity}x {step.service?.name || "Serviço"}
                                        </span>
                                      </li>
                                    ))}
                                    {plan.description && (
                                      <li className="flex items-start gap-2 text-sm text-gray-700">
                                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${styles.text}`} />
                                        <span className="line-clamp-3">{plan.description}</span>
                                      </li>
                                    )}
                                  </ul>
                                </div>

                                <Button
                                  className={`w-full ${styles.button}`}
                                  onClick={() => handleCheckout(plan, 'plan')}
                                >
                                  Contratar Plano
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {plansData.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPlansPage((p) => Math.max(1, p - 1))}
                            disabled={plansPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {Array.from({ length: plansData.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={plansPage === page ? "default" : "outline"}
                              size="icon"
                              onClick={() => setPlansPage(page)}
                              className={plansPage === page ? "bg-purple-600 hover:bg-purple-700" : ""}
                            >
                              {page}
                            </Button>
                          ))}

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPlansPage((p) => Math.min(plansData.totalPages, p + 1))}
                            disabled={plansPage === plansData.totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="bg-white rounded-lg p-6 border shadow-sm">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-6 w-6 text-purple-600" />
                      <h2 className="text-2xl font-bold">Nossos Serviços</h2>
                    </div>
                    <p className="text-gray-600">Conheça todos os serviços oferecidos pela clínica</p>
                  </div>

                  {isLoadingServices ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : !servicesData?.data || servicesData.data.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      Nenhum serviço disponível no momento.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {servicesData.data.map((service: any, index: number) => {
                          const styles = getPlanColorStyles(index);

                          return (
                            <Card key={service.id} className={`border-2 ${styles.bg} ${styles.border}`}>
                              <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                  <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-white/50`}
                                  >
                                    {service.image ? (
                                      <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    ) : (
                                      <Building className={`h-6 w-6 ${styles.text}`} />
                                    )}
                                  </div>
                                  {service.status === "ACTIVE" && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                      ATIVO
                                    </Badge>
                                  )}
                                </div>

                                <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                  {service.description}
                                </p>

                                <div className="space-y-2 mb-6 text-sm flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">💰</span>
                                    <span className={styles.price}>{formatPrice(service.price)}</span>
                                  </div>
                                  {service.duration && (
                                    <div className="flex items-center gap-2">
                                      <Clock className={`h-4 w-4 ${styles.text}`} />
                                      <span>Duração: {service.duration} min</span>
                                    </div>
                                  )}
                                </div>

                                <Button
                                  className={`w-full ${styles.button}`}
                                  onClick={() => handleCheckout(service, 'service')}
                                >
                                  Contratar
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {servicesData.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setServicesPage((p) => Math.max(1, p - 1))}
                            disabled={servicesPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {Array.from({ length: servicesData.totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={servicesPage === page ? "default" : "outline"}
                              size="icon"
                              onClick={() => setServicesPage(page)}
                              className={servicesPage === page ? "bg-purple-600 hover:bg-purple-700" : ""}
                            >
                              {page}
                            </Button>
                          ))}

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setServicesPage((p) => Math.min(servicesData.totalPages, p + 1))}
                            disabled={servicesPage === servicesData.totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
