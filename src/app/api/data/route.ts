import { FileItem } from '@/lib/types';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

const compareFilenames = (a: string, b: string, isDesc = false): number => {
  // Use localeCompare with numeric option for natural sorting
  const result = a.localeCompare(b, undefined, { numeric: true });
  return isDesc ? -result : result;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortType = searchParams.get('sort') || 'date-asc';

    const filePath = path.join(process.cwd(), 'public/data/data.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const records = parse(fileContent, {
      delimiter: ';',
      columns: ['created_at', 'filename'],
      skip_empty_lines: true
    });

    const items: FileItem[] = records.map((record: Record<string, string>) => ({
      filename: record.filename,
      created_at: record.created_at
    }));

    // Sort items based on the sort type
    switch (sortType) {
      case 'date-asc':
        items.sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'filename-asc':
        items.sort((a, b) => compareFilenames(a.filename, b.filename, false));
        break;
      case 'filename-desc':
        items.sort((a, b) => compareFilenames(a.filename, b.filename, true));
        break;
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
