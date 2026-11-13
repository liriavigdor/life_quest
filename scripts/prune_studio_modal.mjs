import fs from 'fs';

let code = fs.readFileSync('src/components/MnemonicStudioModal.jsx', 'utf8').replace(/\r\n/g, '\n');

const startBodyMarker = "{/* Tab Content Container */}";
const endBodyMarker = "{/* Edit Modal (if editing an item) */}";

const startIdx = code.indexOf(startBodyMarker);
const endIdx = code.indexOf(endBodyMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const sandboxStartMarker = "{activeTab === 'sandbox' && (";
  const sandboxStart = code.indexOf(sandboxStartMarker, startIdx);
  const sandboxEndMarker = "{activeTab === 'audited' && (";
  const auditedIdx = code.indexOf(sandboxEndMarker, sandboxStart);

  if (sandboxStart !== -1 && auditedIdx !== -1) {
    // Find the comment before audited
    const lastCommentIdx = code.lastIndexOf('{/* =====', auditedIdx);
    const sandboxBlock = code.slice(sandboxStart, lastCommentIdx !== -1 ? lastCommentIdx : auditedIdx).trim();

    const cleanBody = `        {/* Tab Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* TAB 1: BULK RAPID GRID DESK (גריד המאגר הפעיל) */}
          {activeTab === 'grid' && (
            <BulkImageCurationDesk
              userImages={userImages}
              uploaderName={uploaderName}
              onSwitchTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB 2: SANDBOX (בדיקת התאמות) */}
          ${sandboxBlock}

        </div>

        `;

    code = code.slice(0, startIdx) + cleanBody + code.slice(endIdx);
    console.log('Successfully pruned dead tab bodies from MnemonicStudioModal.jsx');
    fs.writeFileSync('src/components/MnemonicStudioModal.jsx', code, 'utf8');
  } else {
    console.error('Could not find sandbox markers:', sandboxStart, auditedIdx);
  }
} else {
  console.error('Could not find body markers');
}
