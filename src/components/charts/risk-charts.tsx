"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";

export function RiskPie({ ckd, notCkd }: { ckd: number; notCkd: number }) {
  const data = [{ name: "CKD", value: ckd }, { name: "Not CKD", value: notCkd }];
  return <div className="h-64 bg-white rounded-2xl p-4 shadow-sm"><ResponsiveContainer><PieChart><Pie dataKey="value" data={data} outerRadius={80}>{data.map((_, i)=><Cell key={i} fill={i===0?"#0a8a74":"#6b7b78"} />)}</Pie></PieChart></ResponsiveContainer></div>;
}

export function RiskBar({ rows }: { rows: { name: string; risk: number }[] }) {
  return <div className="h-64 bg-white rounded-2xl p-4 shadow-sm"><ResponsiveContainer><BarChart data={rows}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="risk" fill="#0fbfa0" /></BarChart></ResponsiveContainer></div>;
}

export function Trend({ rows }: { rows: { date: string; risk: number }[] }) {
  return <div className="h-64 bg-white rounded-2xl p-4 shadow-sm"><ResponsiveContainer><LineChart data={rows}><XAxis dataKey="date"/><YAxis/><Tooltip/><Line type="monotone" dataKey="risk" stroke="#063d34" strokeWidth={2}/></LineChart></ResponsiveContainer></div>;
}
