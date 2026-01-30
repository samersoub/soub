
import React from 'react';

const ArchitectureDoc: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">المخطط المعماري لنظام Enterprise PM</h1>
        
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">1. تصميم قاعدة البيانات (Schema)</h2>
          <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto">
            <pre>{`
-- Hierarchy Structure
Table Workspaces (id, name, owner_id)
Table Spaces (id, workspace_id, name, settings_json)
Table Folders (id, space_id, name)
Table Lists (id, folder_id, space_id, name)

-- The Core Task Table
Table Tasks (
  id UUID PRIMARY KEY,
  list_id UUID REFERENCES Lists(id),
  parent_task_id UUID REFERENCES Tasks(id), -- Infinite Nesting
  title TEXT NOT NULL,
  status VARCHAR(50),
  priority SMALLINT,
  position FLOAT, -- For drag-and-drop ordering
  created_at TIMESTAMP DEFAULT NOW()
)

-- Custom Fields Strategy (EAV or JSONB)
Table CustomFieldDefinitions (
  id UUID,
  container_id UUID, -- Space or List ID
  field_name TEXT,
  field_type VARCHAR(20), -- TEXT, NUMBER, DROP_DOWN
  config JSONB -- options for dropdowns
)

Table TaskFieldValues (
  task_id UUID,
  field_id UUID,
  value TEXT -- Store as string, cast on app layer
)
            `}</pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">2. نظام البحث الشامل (ElasticSearch)</h2>
          <p className="text-slate-600 mb-4">
            لتحقيق بحث فوري عبر ملايين المهام في المساحات المختلفة، نقوم بمزامنة بيانات PostgreSQL مع ElasticSearch باستخدام <strong>Logstash</strong> أو <strong>CDC (Change Data Capture)</strong>.
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 mr-4">
            <li><strong>Indexing:</strong> نقوم بفهرسة النصوص (Title, Description) وسمات المهمة (Assignees, Status).</li>
            <li><strong>Fuzzy Search:</strong> يدعم البحث عن الكلمات المكتوبة خطأً (e.g. "تطوير" vs "تطوير").</li>
            <li><strong>Filtering:</strong> استخدام Nested Objects في Elastic لتمثيل الصلاحيات، بحيث لا تظهر نتائج للمستخدم لا يملك وصولاً لمساحتها.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">3. الأتمتة (Automation Engine)</h2>
          <div className="bg-indigo-50 border-r-4 border-indigo-500 p-4">
            <p className="text-indigo-900 font-medium">نظام "إذا حدث (Trigger) فافعل (Action)":</p>
            <ul className="mt-2 space-y-1 text-indigo-800 text-sm">
              <li>- <strong>المحفز:</strong> تغيير حالة المهمة، وصول تاريخ الاستحقاق، إضافة تعليق.</li>
              <li>- <strong>المحرك:</strong> يتم تشغيله عبر Node.js Worker Threads أو BullMQ.</li>
              <li>- <strong>الإجراء:</strong> إرسال إشعار، تغيير مكلف جديد، نقل المهمة لقائمة أخرى.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b pb-2">4. المزامنة والعمل دون اتصال (Offline Sync)</h2>
          <p className="text-slate-600">
            في تطبيق الأندرويد، نستخدم <strong>Room Database</strong> كقاعدة بيانات محلية. استراتيجية المزامنة:
          </p>
          <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-600 mr-4">
            <li><strong>Outbox Pattern:</strong> أي عملية تعديل تتم بدون إنترنت تُخزن في جدول <code>PendingActions</code>.</li>
            <li><strong>Sync Worker:</strong> عند عودة الإنترنت، يقوم WorkManager برفع العمليات مع حل النزاعات (Conflicts) باستخدام timestamps.</li>
            <li><strong>WebSockets:</strong> نستخدم Socket.io لتلقي التحديثات الحية من الزملاء وتحديث الواجهة (MVI State) فوراً.</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default ArchitectureDoc;
