export interface WebAppGeneratorSchema {
  name: string;
  framework: 'next' | 'remix' | 'expo';
  apiClient?: boolean;
  includeExamplePage?: boolean;
  routerStyle?: 'app' | 'pages';
}
