export interface WebAppGeneratorSchema {
  name: string;
  framework: 'next' | 'remix';
  apiClient?: boolean;
  includeExamplePage?: boolean;
  routerStyle?: 'app' | 'pages';
}

