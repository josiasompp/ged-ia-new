// Lista de cargos por país com códigos oficiais
export const jobTitlesByCountry = {
  brasil: [
    // Diretoria e Gerência
    { code: "1237-10", title: "Diretor Geral", category: "Diretoria" },
    { code: "1425-15", title: "Gerente Administrativo", category: "Gerência" },
    { code: "1425-10", title: "Gerente Comercial", category: "Gerência" },
    { code: "1425-05", title: "Gerente de Recursos Humanos", category: "Gerência" },
    { code: "1425-20", title: "Gerente Financeiro", category: "Gerência" },
    { code: "1425-25", title: "Gerente de Marketing", category: "Gerência" },
    
    // Administrativo
    { code: "4110-05", title: "Assistente Administrativo", category: "Administrativo" },
    { code: "4110-10", title: "Auxiliar Administrativo", category: "Administrativo" },
    { code: "2521-05", title: "Analista de Recursos Humanos", category: "Administrativo" },
    { code: "2522-10", title: "Analista Contábil", category: "Administrativo" },
    { code: "4131-05", title: "Auxiliar Contábil", category: "Administrativo" },
    { code: "2524-05", title: "Analista Financeiro", category: "Administrativo" },
    
    // Vendas e Comercial
    { code: "3541-05", title: "Vendedor", category: "Comercial" },
    { code: "3541-10", title: "Consultor de Vendas", category: "Comercial" },
    { code: "1414-25", title: "Supervisor de Vendas", category: "Comercial" },
    { code: "2531-05", title: "Analista de Marketing", category: "Comercial" },
    
    // Tecnologia da Informação
    { code: "2124-05", title: "Analista de Sistemas", category: "TI" },
    { code: "2124-10", title: "Programador", category: "TI" },
    { code: "2123-05", title: "Técnico em Informática", category: "TI" },
    { code: "2124-15", title: "Desenvolvedor de Software", category: "TI" },
    { code: "2124-20", title: "Analista de Suporte", category: "TI" },
    
    // Operacional
    { code: "4110-15", title: "Recepcionista", category: "Operacional" },
    { code: "5162-10", title: "Porteiro", category: "Operacional" },
    { code: "5121-05", title: "Auxiliar de Limpeza", category: "Operacional" },
    { code: "7823-05", title: "Motorista", category: "Operacional" },
    { code: "4211-10", title: "Almoxarife", category: "Operacional" },
    
    // Jurídico
    { code: "2412-05", title: "Advogado", category: "Jurídico" },
    { code: "4110-25", title: "Assistente Jurídico", category: "Jurídico" },
    
    // Engenharia
    { code: "2142-05", title: "Engenheiro Civil", category: "Engenharia" },
    { code: "2143-05", title: "Engenheiro de Produção", category: "Engenharia" },
    { code: "2144-05", title: "Engenheiro Elétrico", category: "Engenharia" },
    
    // Outros
    { code: "2635-05", title: "Consultor", category: "Consultoria" },
    { code: "5244-05", title: "Estagiário", category: "Estágio" },
    { code: "9999-99", title: "Outros", category: "Outros" }
  ],
  
  espanha: [
    // Dirección y Gerencia
    { code: "1120", title: "Director General", category: "Dirección" },
    { code: "1212", title: "Director de Recursos Humanos", category: "Dirección" },
    { code: "1211", title: "Director Financiero", category: "Dirección" },
    { code: "1213", title: "Director Comercial", category: "Dirección" },
    { code: "1219", title: "Director de Operaciones", category: "Dirección" },
    
    // Administrativo
    { code: "4110", title: "Empleado de Oficina", category: "Administrativo" },
    { code: "4120", title: "Secretario Administrativo", category: "Administrativo" },
    { code: "2423", title: "Especialista en Recursos Humanos", category: "Administrativo" },
    { code: "2411", title: "Contable", category: "Administrativo" },
    { code: "4311", title: "Auxiliar Contable", category: "Administrativo" },
    
    // Comercial y Ventas
    { code: "5223", title: "Dependiente de Comercio", category: "Comercial" },
    { code: "2431", title: "Especialista en Publicidad y Marketing", category: "Comercial" },
    { code: "3322", title: "Representante Comercial", category: "Comercial" },
    
    // Tecnología
    { code: "2511", title: "Analista de Sistemas", category: "Tecnología" },
    { code: "2512", title: "Desarrollador de Software", category: "Tecnología" },
    { code: "3511", title: "Técnico en TIC", category: "Tecnología" },
    
    // Operacional
    { code: "4224", title: "Recepcionista", category: "Operacional" },
    { code: "5414", title: "Vigilante de Seguridad", category: "Operacional" },
    { code: "9112", title: "Personal de Limpieza", category: "Operacional" },
    { code: "8322", title: "Conductor", category: "Operacional" },
    
    // Jurídico
    { code: "2611", title: "Abogado", category: "Jurídico" },
    { code: "3411", title: "Técnico Jurídico", category: "Jurídico" },
    
    // Ingeniería
    { code: "2142", title: "Ingeniero Civil", category: "Ingeniería" },
    { code: "2151", title: "Ingeniero Eléctrico", category: "Ingeniería" },
    { code: "2143", title: "Ingeniero Industrial", category: "Ingeniería" },
    
    // Otros
    { code: "2422", title: "Especialista en Administración", category: "Consultoría" },
    { code: "5999", title: "Becario", category: "Prácticas" },
    { code: "9999", title: "Otros", category: "Otros" }
  ],
  
  portugal: [
    // Direção e Gestão
    { code: "1120", title: "Diretor Geral", category: "Direção" },
    { code: "1212", title: "Diretor de Recursos Humanos", category: "Direção" },
    { code: "1211", title: "Diretor Financeiro", category: "Direção" },
    { code: "1213", title: "Diretor Comercial", category: "Direção" },
    
    // Administrativo
    { code: "4110", title: "Empregado de Escritório", category: "Administrativo" },
    { code: "4120", title: "Secretário", category: "Administrativo" },
    { code: "2423", title: "Técnico de Recursos Humanos", category: "Administrativo" },
    { code: "2411", title: "Contabilista", category: "Administrativo" },
    { code: "4311", title: "Auxiliar de Contabilidade", category: "Administrativo" },
    
    // Comercial
    { code: "5223", title: "Empregado de Balcão", category: "Comercial" },
    { code: "2431", title: "Técnico de Marketing", category: "Comercial" },
    { code: "3322", title: "Agente Comercial", category: "Comercial" },
    
    // Tecnologia
    { code: "2511", title: "Analista de Sistemas", category: "Tecnologia" },
    { code: "2512", title: "Programador", category: "Tecnologia" },
    { code: "3511", title: "Técnico de Informática", category: "Tecnologia" },
    
    // Operacional
    { code: "4224", title: "Rececionista", category: "Operacional" },
    { code: "5414", title: "Vigilante", category: "Operacional" },
    { code: "9112", title: "Pessoal de Limpeza", category: "Operacional" },
    { code: "8322", title: "Motorista", category: "Operacional" },
    
    // Jurídico
    { code: "2611", title: "Advogado", category: "Jurídico" },
    { code: "3411", title: "Técnico Jurídico", category: "Jurídico" },
    
    // Engenharia
    { code: "2142", title: "Engenheiro Civil", category: "Engenharia" },
    { code: "2151", title: "Engenheiro Eletrotécnico", category: "Engenharia" },
    { code: "2143", title: "Engenheiro Industrial", category: "Engenharia" },
    
    // Outros
    { code: "2422", title: "Consultor", category: "Consultoria" },
    { code: "5999", title: "Estagiário", category: "Estágio" },
    { code: "9999", title: "Outros", category: "Outros" }
  ]
};

// Função para obter cargos por país
export const getJobTitlesByCountry = (country) => {
  return jobTitlesByCountry[country] || [];
};

// Função para obter categorias únicas por país
export const getCategoriesByCountry = (country) => {
  const jobs = getJobTitlesByCountry(country);
  const categories = [...new Set(jobs.map(job => job.category))];
  return categories.sort();
};

// Função para buscar cargo por código
export const getJobTitleByCode = (country, code) => {
  const jobs = getJobTitlesByCountry(country);
  return jobs.find(job => job.code === code);
};