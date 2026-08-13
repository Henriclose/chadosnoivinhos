/**
 * Chá de Casa Nova - Confirmação de Presença
 * Planilha: https://docs.google.com/spreadsheets/d/1oeuGhI9zqDUlvpxsIe3xTAUfh6tm0ia3RzoNNz9l8Rc/edit
 *
 * COMO PUBLICAR:
 * 1. Abra a planilha acima
 * 2. Extensões > Apps Script
 * 3. Apague o código padrão e cole TODO este arquivo
 * 4. Clique em Salvar
 * 5. Implantar > Nova implantação
 * 6. Tipo: App da Web
 * 7. Descrição: RSVP Chá de Casa Nova
 * 8. Executar como: Eu
 * 9. Quem tem acesso: Qualquer pessoa
 * 10. Clique em Implantar e autorize a conta Google
 * 11. Copie a URL da implantação (termina com /exec)
 * 12. Cole essa URL no index.html, na constante GOOGLE_SCRIPT_URL
 */

var SPREADSHEET_ID = '1oeuGhI9zqDUlvpxsIe3xTAUfh6tm0ia3RzoNNz9l8Rc';
var SHEET_NAME = 'Confirmacoes';

function doPost(e) {
  try {
    var data = {};

    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    var ss = SpreadsheetApp.openById(data.sheetId || SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Data/Hora',
        'Nome Completo',
        'Comparecerá',
        'Acompanhantes',
        'Mensagem'
      ]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Se a planilha já existir mas estiver vazia, cria o cabeçalho
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Nome Completo',
        'Comparecerá',
        'Acompanhantes',
        'Mensagem'
      ]);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      data.nome || '',
      data.attendance || '',
      data.acompanhantes || '0',
      data.mensagem || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Endpoint de confirmação de presença ativo.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
