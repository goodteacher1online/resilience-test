// 스프레드시트 고유 ID (컨텍스트 무관 안전 접근)
var SPREADSHEET_ID = '1kOkRaq1os54MS8MA30T45xZ8-MBZl6cP-ymCo6VQqpU';

function getTargetSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      Logger.log('Spreadsheet open error: ' + e);
    }
  }
  return ss;
}

// 웹앱 진입점
function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  var output = template.evaluate()
    .setTitle('🏎️ 하이퍼 슈퍼카 & 🎀 러블리 드림하우스 - 초등 회복탄력성 검사')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}

// 스프레드시트 열릴 때 커스텀 메뉴 추가
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🌟 회복탄력성 검사')
    .addItem('🌐 학생용 검사 웹앱 열기', 'openWebAppUrl')
    .addItem('📊 시트 구조 및 서식 초기화', 'setupSpreadsheet')
    .addItem('📈 통계 대시보드 새로고침', 'refreshDashboard')
    .addSeparator()
    .addItem('📖 교사용 지도 안내서', 'showTeacherGuide')
    .addToUi();
}

// 웹앱 URL 안내 팝업
function openWebAppUrl() {
  var scriptAppUrl = ScriptApp.getService().getUrl();
  var html = '<div style="font-family:sans-serif; padding:15px; text-align:center;">' +
    '<h3>🌟 학생용 회복탄력성 검사 웹앱</h3>' +
    '<p>아래 링크를 복사하여 학생들에게 배부하거나 태블릿에서 여세요.</p>' +
    (scriptAppUrl ? '<p><a href="' + scriptAppUrl + '" target="_blank" style="display:inline-block; padding:10px 18px; background:#4CAF50; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold;">새 탭에서 웹앱 열기</a></p>' +
    '<input type="text" value="' + scriptAppUrl + '" style="width:90%; padding:8px; border:1px solid #ccc; border-radius:4px; text-align:center;" readonly onclick="this.select();">'
    : '<p style="color:#d32f2f;">웹앱이 아직 배포되지 않았습니다.<br>상단 [배포] -> [새 배포] -> [웹 앱]으로 배포를 완료해주세요.</p>') +
    '</div>';
  var userInterface = HtmlService.createHtmlOutput(html).setWidth(460).setHeight(260);
  SpreadsheetApp.getUi().showModalDialog(userInterface, '웹앱 주소 확인');
}

// 교사용 지도 안내서 모달
function showTeacherGuide() {
  var html = '<div style="font-family:sans-serif; padding:15px; line-height:1.6;">' +
    '<h3 style="color:#2E7D32;">🌱 초등학교 회복탄력성 검사 안내</h3>' +
    '<p><b>회복탄력성이란?</b> 힘든 일이나 실패를 겪었을 때 오뚝이처럼 다시 툭툭 털고 일어나는 마음의 힘(마음 근육)입니다.</p>' +
    '<hr style="border:0; border-top:1px solid #eee;">' +
    '<h4 style="color:#1565C0;">📌 점수 해석 기준 (총점: 18~90점)</h4>' +
    '<ul>' +
    '<li><b>75점 이상 (매우 높은 편)</b>: 상위 10% 이내. 어려움에 긍정적으로 대처하며 주변에 좋은 영향을 줍니다.</li>' +
    '<li><b>70~74점 (높은 편)</b>: 상위 20% 이내. 건강한 자기 회복력을 보유하고 있습니다.</li>' +
    '<li><b>53~69점 (보통)</b>: 평균 수준 (청소년 평균 기준 61점). 상황에 따라 안정적으로 극복합니다.</li>' +
    '<li><b>48~52점 (낮은 편)</b>: 상위 80% 이상. 좌절 상황에서 쉽게 지칠 수 있어 교사의 지지와 격려가 필요합니다.</li>' +
    '<li><b>47점 이하 (매우 낮은 편)</b>: 상위 90% 이상. 자아존중감 및 정서적 안정 지원이 우선적으로 필요합니다.</li>' +
    '</ul>' +
    '<h4 style="color:#1565C0;">📌 6대 하위 영역 (각 3문항, 3~15점)</h4>' +
    '<ul>' +
    '<li><b>과제지속(끈기력)</b>: 1, 2, 3번 - 목표를 세우고 끝까지 해내는 힘</li>' +
    '<li><b>감정조절(마음다스림)</b>: 4, 5, 6번 - 속상하거나 화날 때 스스로 진정하는 힘</li>' +
    '<li><b>긍정성(자아존중)</b>: 7, 8, 9번 - 나를 소중히 여기고 행복을 느끼는 마음</li>' +
    '<li><b>대인관계(친화력)</b>: 10, 11, 12번 - 타인의 마음에 공감하고 친해지는 능력</li>' +
    '<li><b>사회적지지(친구우정)</b>: 13, 14, 15번 - 힘들 때 도와주고 들어줄 친구 관계</li>' +
    '<li><b>자기표현(자신감)</b>: 16, 17, 18번 - 여러 사람 앞에서 발표하고 설득하는 용기</li>' +
    '</ul>' +
    '</div>';
  var userInterface = HtmlService.createHtmlOutput(html).setWidth(520).setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(userInterface, '교사용 지도 가이드');
}

// 시트 초기화 및 서식 설정
function setupSpreadsheet() {
  var ss = getTargetSpreadsheet();
  
  // 1. 응답 데이터 시트
  var dataSheet = ss.getSheetByName('응답데이터');
  if (!dataSheet) {
    dataSheet = ss.insertSheet('응답데이터', 0);
  }
  
  var headers = [
    '제출일시', '학교', '학년', '반', '번호', '이름',
    'Q1.끈기', 'Q2.끝까지', 'Q3.재도전',
    'Q4.감정다스림', 'Q5.기분전환', 'Q6.스트레스차분',
    'Q7.행복감', 'Q8.긍정성', 'Q9.자기가치',
    'Q10.호감자신', 'Q11.신뢰감', 'Q12.타인이해',
    'Q13.도움친구', 'Q14.의지친구', 'Q15.경청친구',
    'Q16.자신발표', 'Q17.당황극복', 'Q18.설득력',
    '총점', '수준(판정)', '백분위 위치',
    '끈기력(15점)', '감정조절(15점)', '긍정성(15점)',
    '친화력(15점)', '친구지지(15점)', '자신감(15점)',
    '맞춤형 지도 조언'
  ];
  
  dataSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = dataSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#2E7D32')
             .setFontColor('#FFFFFF')
             .setFontWeight('bold')
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle');
  dataSheet.setRowHeight(1, 38);
  dataSheet.setFrozenRows(1);
  dataSheet.setFrozenColumns(6);
  
  // 2. 대시보드 시트
  var dashSheet = ss.getSheetByName('학급통계대시보드');
  if (!dashSheet) {
    dashSheet = ss.insertSheet('학급통계대시보드', 1);
  }
  
  formatDashboard(dashSheet);
  refreshDashboard();
  
  try {
    if (ss && ss.toast) {
      ss.toast('시트 초기화 및 서식 설정이 완료되었습니다!', '알림', 3);
    }
  } catch (e) {}
}

// 대시보드 서식 디자인
function formatDashboard(sheet) {
  sheet.clear();
  sheet.setColumnWidth(1, 30);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 130);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 180);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 130);
  
  // 제목 타이틀
  sheet.getRange('B2:G2').merge()
    .setValue('🌱 초등학교 회복탄력성 검사 결과 대시보드')
    .setBackground('#E8F5E9')
    .setFontColor('#1B5E20')
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 45);
  
  // 요약 KPI 카드 헤더
  sheet.getRange('B4:D4').merge().setValue('📊 학급 종합 현황').setBackground('#C8E6C9').setFontWeight('bold').setFontColor('#1B5E20');
  sheet.getRange('B5').setValue('총 참여 학생수');
  sheet.getRange('B6').setValue('학급 평균 총점 (90점 만점)');
  sheet.getRange('B7').setValue('전국 청소년 기준 평균');
  sheet.getRange('C7').setValue('61.0점');
  sheet.getRange('B8').setValue('최고점 / 최저점');
  
  // 수준별 분포표
  sheet.getRange('E4:G4').merge().setValue('🌈 수준별 학생 분포').setBackground('#C8E6C9').setFontWeight('bold').setFontColor('#1B5E20');
  sheet.getRange('E5').setValue('매우 높은 편 (75점 이상)');
  sheet.getRange('E6').setValue('높은 편 (70~74점)');
  sheet.getRange('E7').setValue('보통 (53~69점)');
  sheet.getRange('E8').setValue('낮은 편 (48~52점)');
  sheet.getRange('E9').setValue('매우 낮은 편 (47점 이하)');
  
  // 하위 6대 영역 평균표
  sheet.getRange('B11:D11').merge().setValue('🎯 6대 하위 영역별 평균 (각 15점 만점)').setBackground('#C8E6C9').setFontWeight('bold').setFontColor('#1B5E20');
  sheet.getRange('B12').setValue('1. 과제지속(끈기력)');
  sheet.getRange('B13').setValue('2. 감정조절(마음다스림)');
  sheet.getRange('B14').setValue('3. 긍정성(자아존중)');
  sheet.getRange('B15').setValue('4. 대인관계(친화력)');
  sheet.getRange('B16').setValue('5. 사회적지지(친구우정)');
  sheet.getRange('B17').setValue('6. 자기표현(자신감)');
  
  // 관심 지도 필요 학생 목록
  sheet.getRange('E11:G11').merge().setValue('🧡 따뜻한 관심과 격려가 필요한 학생 (52점 이하)').setBackground('#FFECB3').setFontWeight('bold').setFontColor('#E65100');
  sheet.getRange('E12').setValue('이름 (번호)');
  sheet.getRange('F12').setValue('총점');
  sheet.getRange('G12').setValue('수준');
  sheet.getRange('E12:G12').setBackground('#FFF8E1').setFontWeight('bold');
  
  sheet.getRange('B4:D8').setBorder(true, true, true, true, true, true, '#BDBDBD', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange('E4:G9').setBorder(true, true, true, true, true, true, '#BDBDBD', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange('B11:D17').setBorder(true, true, true, true, true, true, '#BDBDBD', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange('E11:G17').setBorder(true, true, true, true, true, true, '#BDBDBD', SpreadsheetApp.BorderStyle.SOLID);
}

// 대시보드 데이터 새로고침
function refreshDashboard() {
  var ss = getTargetSpreadsheet();
  var dataSheet = ss.getSheetByName('응답데이터');
  var dashSheet = ss.getSheetByName('학급통계대시보드');
  if (!dataSheet || !dashSheet) return;
  
  var lastRow = dataSheet.getLastRow();
  if (lastRow < 2) {
    dashSheet.getRange('C5').setValue('0명');
    dashSheet.getRange('C6').setValue('-');
    dashSheet.getRange('C8').setValue('- / -');
    dashSheet.getRange('F5:G9').setValues([['0명', '0%'], ['0명', '0%'], ['0명', '0%'], ['0명', '0%'], ['0명', '0%']]);
    dashSheet.getRange('C12:C17').setValues([['-'], ['-'], ['-'], ['-'], ['-'], ['-']]);
    return;
  }
  
  var data = dataSheet.getRange(2, 1, lastRow - 1, 34).getValues();
  var count = data.length;
  
  var totalScores = [];
  var domainScores = [0, 0, 0, 0, 0, 0]; // 끈기, 감정, 긍정, 친화, 지지, 자신감
  var levelCounts = {
    '매우높음': 0,
    '높음': 0,
    '보통': 0,
    '낮음': 0,
    '매우낮음': 0
  };
  var needCareStudents = [];
  var latestSchoolName = '';
  
  for (var i = 0; i < count; i++) {
    var row = data[i];
    var school = String(row[1] || '');
    if (school && school !== '미입력') latestSchoolName = school;
    var studentNum = row[4];
    var studentName = row[5];
    var score = Number(row[24]) || 0;
    var level = String(row[25]);
    
    totalScores.push(score);
    
    // 도메인 점수 합산 (인덱스 27~32)
    for (var d = 0; d < 6; d++) {
      domainScores[d] += Number(row[27 + d]) || 0;
    }
    
    if (score >= 75) levelCounts['매우높음']++;
    else if (score >= 70) levelCounts['높음']++;
    else if (score >= 53) levelCounts['보통']++;
    else if (score >= 48) levelCounts['낮음']++;
    else levelCounts['매우낮음']++;
    
    if (score <= 52) {
      needCareStudents.push([studentName + ' (' + studentNum + '번)', score + '점', score <= 47 ? '매우 낮음' : '낮음']);
    }
  }
  
  // 대시보드 제목에 학교명 반영
  if (latestSchoolName) {
    try {
      dashSheet.getRange('B2:G2').setValue('🌱 [' + latestSchoolName + '] 회복탄력성 검사 결과 대시보드');
    } catch (e) {}
  }
  
  var sum = totalScores.reduce(function(a, b) { return a + b; }, 0);
  var avg = (sum / count).toFixed(1);
  var max = Math.max.apply(null, totalScores);
  var min = Math.min.apply(null, totalScores);
  
  // KPI 업데이트
  dashSheet.getRange('C5').setValue(count + '명').setFontWeight('bold').setHorizontalAlignment('center');
  dashSheet.getRange('C6').setValue(avg + '점').setFontWeight('bold').setHorizontalAlignment('center');
  dashSheet.getRange('C8').setValue(max + '점 / ' + min + '점').setHorizontalAlignment('center');
  
  // 수준별 분포표 업데이트
  var levelRows = [
    [levelCounts['매우높음'] + '명', ((levelCounts['매우높음'] / count) * 100).toFixed(1) + '%'],
    [levelCounts['높음'] + '명', ((levelCounts['높음'] / count) * 100).toFixed(1) + '%'],
    [levelCounts['보통'] + '명', ((levelCounts['보통'] / count) * 100).toFixed(1) + '%'],
    [levelCounts['낮음'] + '명', ((levelCounts['낮음'] / count) * 100).toFixed(1) + '%'],
    [levelCounts['매우낮음'] + '명', ((levelCounts['매우낮음'] / count) * 100).toFixed(1) + '%']
  ];
  dashSheet.getRange('F5:G9').setValues(levelRows).setHorizontalAlignment('center');
  
  // 6대 영역 평균
  var domainAvgRows = [];
  for (var k = 0; k < 6; k++) {
    domainAvgRows.push([(domainScores[k] / count).toFixed(1) + '점 / 15점']);
  }
  dashSheet.getRange('C12:C17').setValues(domainAvgRows).setHorizontalAlignment('center');
  
  // 관심 필요 학생 리스트 초기화 후 기록 (최대 10명)
  dashSheet.getRange('E13:G22').clearContent();
  if (needCareStudents.length > 0) {
    var displayCare = needCareStudents.slice(0, 10);
    dashSheet.getRange(13, 5, displayCare.length, 3).setValues(displayCare).setHorizontalAlignment('center');
  } else {
    dashSheet.getRange('E13:G13').merge().setValue('모든 학생이 보통 이상의 안정적인 회복탄력성을 보이고 있습니다! 🎉').setHorizontalAlignment('center').setFontColor('#2E7D32');
  }
}

// 클라이언트에서 설문 응답 제출 처리
function submitAssessment(formData) {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss.getSheetByName('응답데이터');
    if (!sheet) {
      setupSpreadsheet();
      sheet = ss.getSheetByName('응답데이터');
    }
    
    var answers = formData.answers; // 배열 [score1, score2, ..., score18]
    if (!answers || answers.length !== 18) {
      return { success: false, message: '모든 문항(18문항)에 답변해주세요!' };
    }
    
    var totalScore = 0;
    var numericAnswers = [];
    for (var i = 0; i < 18; i++) {
      var val = parseInt(answers[i], 10);
      if (isNaN(val) || val < 1 || val > 5) {
        val = 3; // 기본값 방어
      }
      numericAnswers.push(val);
      totalScore += val;
    }
    
    // 하위 6대 영역 계산 (각 3문항 합)
    var d1_grit = numericAnswers[0] + numericAnswers[1] + numericAnswers[2];         // 끈기/과제지속
    var d2_emotion = numericAnswers[3] + numericAnswers[4] + numericAnswers[5];      // 감정조절
    var d3_positive = numericAnswers[6] + numericAnswers[7] + numericAnswers[8];     // 긍정성/자기가치
    var d4_relation = numericAnswers[9] + numericAnswers[10] + numericAnswers[11];   // 친화력/호감
    var d5_support = numericAnswers[12] + numericAnswers[13] + numericAnswers[14];   // 친구지지/우정
    var d6_efficacy = numericAnswers[15] + numericAnswers[16] + numericAnswers[17];  // 발표/자신감
    
    // 점수대별 판정 및 백분위 (요청 이미지 규격 정확 준수)
    var level = '';
    var percentileDesc = '';
    var badgeName = '';
    var badgeIcon = '';
    var studentFeedback = '';
    var teacherAdvice = '';
    
    if (totalScore >= 75) {
      level = '매우 높은 편';
      percentileDesc = '백분위 90% 이상 (상위 10%)';
      badgeName = '황금 오뚝이 챔피언 👑';
      badgeIcon = '👑';
      studentFeedback = '와우, 최고예요! 넘어져도 미소를 지으며 벌떡 일어나는 멋진 마음 챔피언이에요! 친구들에게도 밝은 햇살 같은 힘을 나눠줄 수 있어요.';
      teacherAdvice = '높은 긍정성과 자기효능감을 보유하고 있습니다. 학급 내 긍정 리더로서 다른 친구들을 돕고 지지해 줄 수 있도록 기회를 부여해주세요.';
    } else if (totalScore >= 70) {
      level = '높은 편';
      percentileDesc = '백분위 80% 이상 (상위 20%)';
      badgeName = '용감한 마음 탐험가 ⭐';
      badgeIcon = '⭐';
      studentFeedback = '대단해요! 어떤 어려운 일이 생겨도 씩씩하게 이겨내는 튼튼한 마음 방패를 가지고 있군요. 항상 스스로를 믿어보세요!';
      teacherAdvice = '안정적이고 건강한 회복탄력성을 지니고 있습니다. 지속적인 칭찬과 작은 성취 경험을 통해 현재의 강점을 유지하도록 격려해주세요.';
    } else if (totalScore >= 53) {
      level = '보통 (평균 수준)';
      percentileDesc = '백분위 21% ~ 79% (청소년 평균: 61점)';
      badgeName = '씩씩한 오뚝이 요정 🎈';
      badgeIcon = '🎈';
      studentFeedback = '참 잘했어요! 흔들려도 금방 중심을 잡는 멋진 오뚝이 요정이에요! 조금씩 마음 근육을 더 키우면 슈퍼파워가 생길 거예요.';
      teacherAdvice = '표준적인 수준의 적응력을 보이고 있습니다. 감정이 상하거나 과제가 어려울 때 구체적인 해결 전략(심호흡, 도움 요청하기)을 지도하면 좋습니다.';
    } else if (totalScore >= 48) {
      level = '낮은 편';
      percentileDesc = '백분위 20% 이하 (하위 20%)';
      badgeName = '쑥쑥 자라는 새싹 🌱';
      badgeIcon = '🌱';
      studentFeedback = '괜찮아요, 힘든 일이 있을 때는 잠깐 쉬어가도 돼요! 선생님과 친구들에게 언제든 "도와줘!"라고 말해보세요. 넌 할 수 있어!';
      teacherAdvice = '스트레스 상황이나 실패 경험 시 쉽게 위축될 수 있습니다. 따뜻한 공감과 지지, 아주 작은 성공 경험을 자주 경험하게 해주세요.';
    } else {
      level = '매우 낮은 편';
      percentileDesc = '백분위 10% 이하 (하위 10%)';
      badgeName = '따스함이 필요한 아기 씨앗 🌰';
      badgeIcon = '🌰';
      studentFeedback = '마음이 속상하고 힘들 때가 많았나요? 언제나 널 응원하고 지켜봐 주는 선생님과 친구들이 곁에 있어요. 사랑받기 위해 태어난 소중한 너란다!';
      teacherAdvice = '정서적 안정 및 자아존중감 향상을 위한 지속적 관심과 상담이 필요합니다. 친구 관계 형성 및 성공 경험을 적극적으로 지원해주세요.';
    }
    
    // 시트에 저장
    var now = new Date();
    var formattedDate = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    
    var newRow = [
      formattedDate,
      formData.schoolName || '미입력',
      formData.grade || '',
      formData.classNum || '',
      formData.studentNum || '',
      formData.name || '무명 탐험가'
    ];
    
    // 18문항 점수 추가
    for (var j = 0; j < 18; j++) {
      newRow.push(numericAnswers[j]);
    }
    
    // 요약 및 분석 데이터 추가
    newRow.push(
      totalScore,
      level,
      percentileDesc,
      d1_grit,
      d2_emotion,
      d3_positive,
      d4_relation,
      d5_support,
      d6_efficacy,
      teacherAdvice
    );
    
    sheet.appendRow(newRow);
    
    // 대시보드 자동 갱신
    try {
      refreshDashboard();
    } catch (e) {
      // 대시보드 갱신 실패해도 학생 응답 처리는 완료
    }
    
    return {
      success: true,
      result: {
        avatar: formData.avatar || '🐰',
        schoolName: formData.schoolName || '',
        name: formData.name,
        grade: formData.grade || '',
        classNum: formData.classNum || '',
        studentNum: formData.studentNum || '',
        totalScore: totalScore,
        level: level,
        percentileDesc: percentileDesc,
        badgeName: badgeName,
        badgeIcon: badgeIcon,
        studentFeedback: studentFeedback,
        dateString: Utilities.formatDate(now, 'Asia/Seoul', 'yyyy년 MM월 dd일'),
        domains: [
          { name: '끈기력(과제지속)', score: d1_grit, max: 15, icon: '🔥', desc: '목표를 정하면 끝까지 해내는 힘' },
          { name: '마음다스림(감정조절)', score: d2_emotion, max: 15, icon: '💧', desc: '화나거나 속상할 때 스스로 차분해지는 힘' },
          { name: '긍정마음(자아존중)', score: d3_positive, max: 15, icon: '☀️', desc: '나 자신을 사랑하고 행복을 느끼는 힘' },
          { name: '친화력(친구사귀기)', score: d4_relation, max: 15, icon: '🤝', desc: '친구의 마음을 알고 다정하게 다가가는 힘' },
          { name: '친구우정(사회적지지)', score: d5_support, max: 15, icon: '💖', desc: '힘들 때 손을 잡아줄 든든한 친구들의 힘' },
          { name: '당당자신감(자기표현)', score: d6_efficacy, max: 15, icon: '📢', desc: '친구들 앞에서 씩씩하게 생각을 말하는 힘' }
        ]
      }
    };
  } catch (error) {
    return {
      success: false,
      message: '저장 중 오류가 발생했습니다: ' + error.toString()
    };
  }
}
