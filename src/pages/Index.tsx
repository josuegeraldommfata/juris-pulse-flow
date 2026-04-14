import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Users, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      toast.success(`Bem-vindo ao Portal ${selectedRole === 'admin' ? 'Administrativo' : 'do Integrador'}`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0a0a0a] to-[#0a0a0a]">
      <AnimatePresence mode="wait">
        {!selectedRole ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid md:grid-cols-2 gap-8 max-w-4xl w-full"
          >
            <RoleCard 
              title="Portal Administrador"
              description="Gestão de instâncias, usuários e monitoramento global"
              icon={<ShieldCheck className="h-12 w-12 text-primary" />}
              onClick={() => {
                setSelectedRole('admin');
                setEmail('admin@jurisai.com');
              }}
            />
            <RoleCard 
              title="Portal Integrador"
              description="Gestão de processos, leads e atendimentos automáticos"
              icon={<Users className="h-12 w-12 text-indigo-500" />}
              onClick={() => {
                setSelectedRole('integrador');
                setEmail('integrador@jurisai.com');
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md"
          >
            <Card className="glass-card border-white/10">
              <CardHeader>
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="w-fit flex items-center text-sm text-muted-foreground hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                </button>
                <div className="flex items-center gap-3 mb-2">
                  {selectedRole === 'admin' ? <ShieldCheck className="text-primary" /> : <Users className="text-indigo-500" />}
                  <CardTitle className="text-2xl">Acesso {selectedRole === 'admin' ? 'Master' : 'Integrador'}</CardTitle>
                </div>
                <CardDescription>
                  Insira suas credenciais para acessar o painel {selectedRole === 'admin' ? 'administrativo' : 'do escritório'}.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 focus:border-primary/50"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar no Sistema"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoleCard = ({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) => (
  <Card 
    className="glass-card border-white/10 hover:border-primary/50 transition-all cursor-pointer group hover:scale-105 active:scale-95"
    onClick={onClick}
  >
    <CardHeader className="items-center text-center space-y-4 py-12">
      <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <div className="space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="max-w-[200px]">
          {description}
        </CardDescription>
      </div>
    </CardHeader>
  </Card>
);

export default Index;
