import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {Outlet,createRootRouteWithContext} from '@tanstack/react-router';
import {AuthProvider} from '@/lib/auth';
import {Toaster} from '@/components/ui/sonner';
export const Route=createRootRouteWithContext<{queryClient:QueryClient}>()({component:Root,notFoundComponent:()=> <div className="p-12 text-center">Página não encontrada</div>});
function Root(){const {queryClient}=Route.useRouteContext();return <QueryClientProvider client={queryClient}><AuthProvider><Outlet/><Toaster richColors position="top-right"/></AuthProvider></QueryClientProvider>}
