import fs from 'fs';
import { NextRequest } from 'next/server';

export const dynamic = 'force-static';

type SortType = 'DASC' | 'FASC' | 'FDESC';

export async function GET(request: NextRequest) {
  const sortType = request.nextUrl.search || 'DASC';
  const sort = sortType as SortType;
  const parsedData: { date: string; filename: string }[] = [];

  const data = fs.readFileSync('data/data.csv', 'utf8');
  const rows = data.split('\n');
  // 2023-06-25 11:00;1abc.txt
  rows.forEach((item: string) => {
    const [date, filename] = item.split(';');
    parsedData.push({ date, filename });
  });
  // date ascending sort
  if (sort === 'DASC') {
    parsedData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  } else if (sort === 'FASC') {
    // filename ascending sort
    parsedData.sort((a, b) => compareFileName(a.filename, b.filename));
  } else if (sort === 'FDESC') {
    // filename descending sort
    parsedData.sort((a, b) => compareFileName(b.filename, a.filename));
  }
  return Response.json({ parsedData });
}

function compareFileName(a: string, b: string) {
  const regex = /^(\d*)(.*)$/;
  const [, numA, textA] = a.match(regex) || [];
  const [, numB, textB] = b.match(regex) || [];

  if (numA == undefined || numB == undefined) {
    return textA.localeCompare(textB);
  }
  if (numA !== numB) {
    return (numA || '').localeCompare(numB || '', undefined, { numeric: true });
  }
  return textA.localeCompare(textB);
}
