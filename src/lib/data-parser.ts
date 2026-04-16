import { TestCase, Platform, Priority, TestStatus } from '@/types/test';

export function parseSheetData(values: string[][]): TestCase[] {
  const cases: TestCase[] = [];
  const headers = values[0];

  // Find column indices
  const idIdx = headers.indexOf('ID');
  const titleIdx = headers.indexOf('Caso de Prueba');
  const epicIdx = headers.indexOf('Épica');
  const userStoryIdx = headers.indexOf('Historia de Usuario');
  const descriptionIdx = headers.indexOf('Descripción del Escenario');
  const givenIdx = headers.indexOf('Given');
  const whenIdx = headers.indexOf('When');
  const thenIdx = headers.indexOf('Then');
  const priorityIdx = headers.indexOf('Prioridad');
  const okIdx = headers.indexOf('OK');
  const koIdx = headers.indexOf('KO');
  const notesIdx = headers.indexOf('Notas');
  const statusIdx = headers.indexOf('Estado');
  const linkBugIdx = headers.indexOf('Link Bug');

  // Platforms are columns 4, 5, 6 (iOS, Android, Web)
  const platformMap: Record<number, Platform> = {
    4: 'iOS',
    5: 'Android',
    6: 'Web'
  };

  // Parse rows starting from index 1 (after headers)
  for (let i = 1; i < values.length; i++) {
    const row = values[i];

    // Extract platforms
    const platforms: Platform[] = [];
    Object.entries(platformMap).forEach(([colIdx, platform]) => {
      if (row[parseInt(colIdx)] === platform) {
        platforms.push(platform);
      }
    });

    const testCase: TestCase = {
      id: row[idIdx] || `TC-${i}`,
      title: row[titleIdx] || '',
      epic: row[epicIdx] || '',
      userStory: row[userStoryIdx] || '',
      platforms,
      description: row[descriptionIdx] || '',
      given: row[givenIdx] || '',
      when: row[whenIdx] || '',
      then: row[thenIdx] || '',
      priority: (row[priorityIdx] as Priority) || 'MEDIUM',
      ok: row[okIdx] === '✓' || row[okIdx] === 'TRUE' || row[okIdx] === 'true',
      ko: row[koIdx] === '✓' || row[koIdx] === 'TRUE' || row[koIdx] === 'true',
      notes: row[notesIdx] || '',
      responsible: '',
      status: (row[statusIdx] as TestStatus) || 'Pending',
      linkBug: row[linkBugIdx] || ''
    };

    cases.push(testCase);
  }

  return cases;
}

export function exportToCSV(testCases: TestCase[]): string {
  const headers = [
    'ID', 'Caso de Prueba', 'Épica', 'Historia de Usuario', 'Plataformas',
    'Descripción', 'Given', 'When', 'Then', 'Prioridad', 'OK', 'KO',
    'Notas', 'Responsable', 'Estado', 'Link Bug'
  ];

  const rows = testCases.map(tc => [
    tc.id,
    tc.title,
    tc.epic,
    tc.userStory,
    tc.platforms.join(', '),
    tc.description,
    tc.given,
    tc.when,
    tc.then,
    tc.priority,
    tc.ok ? '✓' : '',
    tc.ko ? '✓' : '',
    tc.notes,
    tc.responsible,
    tc.status,
    tc.linkBug
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function calculateStats(testCases: TestCase[]) {
  return {
    total: testCases.length,
    pending: testCases.filter(t => t.status === 'Pending').length,
    inProgress: testCases.filter(t => t.status === 'In Progress').length,
    done: testCases.filter(t => t.status === 'DONE').length,
    blocked: testCases.filter(t => t.status === 'BLOCKED').length,
    passed: testCases.filter(t => t.ok).length,
    failed: testCases.filter(t => t.ko).length,
    byPriority: {
      URGENT: testCases.filter(t => t.priority === 'URGENT').length,
      HIGH: testCases.filter(t => t.priority === 'HIGH').length,
      MEDIUM: testCases.filter(t => t.priority === 'MEDIUM').length,
      LOW: testCases.filter(t => t.priority === 'LOW').length
    },
    byPlatform: {
      iOS: testCases.filter(t => t.platforms.includes('iOS')).length,
      Android: testCases.filter(t => t.platforms.includes('Android')).length,
      Web: testCases.filter(t => t.platforms.includes('Web')).length
    },
    byEpic: testCases.reduce((acc, tc) => {
      acc[tc.epic] = (acc[tc.epic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}