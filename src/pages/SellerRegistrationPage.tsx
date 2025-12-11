import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const SellerRegistrationPage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    country: "",
    businessType: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí irá la lógica de registro
    console.log("Form submitted:", formData);
  };

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Acceso a Mayoristas",
      description: "Vende tus productos a mayoristas en toda la región",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Pagos Seguros",
      description: "Sistema de pago anticipado verificado y confiable",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Crece tu Negocio",
      description: "Herramientas para gestionar tu catálogo y ventas",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded bg-red-500 flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-bold text-lg">SIVER Market</span>
          </Link>
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Crecimiento B2B Garantizado
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Únete a SIVER Market y vende tus productos a mayoristas.
            Plataforma segura, pagos anticipados y acceso a nuevos mercados.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-4 text-indigo-600">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Registration Form Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Value prop */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">¿Por qué unirse a SIVER?</h2>
            
            <ul className="space-y-4">
              {[
                "Acceso a múltiples mayoristas de la región",
                "Pagos anticipados - Sin esperar a cobrar",
                "Panel de control para gestionar productos",
                "Soporte dedicado en español",
                "Comisiones competitivas",
                "Red de puntos de recogida",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Solicitar acceso</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Negocio *
                </label>
                <Input
                  type="text"
                  placeholder="Ej: Mi Empresa S.A."
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (509) 1234-5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecciona tu país</option>
                  <option value="haiti">Haití</option>
                  <option value="república-dominicana">República Dominicana</option>
                  <option value="jamaica">Jamaica</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Negocio *
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Selecciona tu tipo de negocio</option>
                  <option value="retail">Tienda Minorista</option>
                  <option value="distribuidor">Distribuidor</option>
                  <option value="mayorista">Mayorista</option>
                  <option value="fabricante">Fabricante</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                >
                  Solicitar Acceso
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-gray-600 text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/seller/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>&copy; 2024 SIVER Market. Plataforma B2B de Comercio Mayorista.</p>
        </div>
      </footer>
    </div>
  );
};

export default SellerRegistrationPage;
