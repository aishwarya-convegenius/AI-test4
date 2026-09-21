// Seven-screen pagination: any button with data-target swaps which .page
// is visible and updates the progress dots. Purely visual, in-memory
// state only — nothing is saved or sent anywhere.
document.addEventListener('DOMContentLoaded', function () {
  var pages = document.querySelectorAll('.page');
  var dots = document.querySelectorAll('.progress-dot');

  function showPage(index) {
    pages.forEach(function (page, i) {
      page.hidden = i !== index;
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Carry the task name from Step 1 into the request builder's Task
    // field on Step 2, so the learner doesn't have to retype it.
    if (index === 2) {
      var taskName = document.getElementById('task-name');
      var builderTask = document.getElementById('b-task');
      if (taskName && builderTask && taskName.value.trim() && !builderTask.value.trim()) {
        builderTask.value = taskName.value.trim();
        builderTask.dispatchEvent(new Event('input'));
      }
    }
  }

  document.querySelectorAll('[data-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showPage(parseInt(btn.getAttribute('data-target'), 10));
    });
  });
});

// Request builder: 4 fields assemble into one live preview sentence,
// plus a copy-to-clipboard button with a fallback for older browsers.
document.addEventListener('DOMContentLoaded', function () {
  var role = document.getElementById('b-role');
  var context = document.getElementById('b-context');
  var task = document.getElementById('b-task');
  var format = document.getElementById('b-format');
  var preview = document.getElementById('prompt-preview');
  if (!role) return;
  var fields = [role, context, task, format];

  function update() {
    var r = role.value.trim() || '___';
    var c = context.value.trim() || '___';
    var t = task.value.trim() || '___';
    var f = format.value.trim() || '___';
    preview.textContent = 'You are ' + r + '. For ' + c + ', ' + t + '. Format it as ' + f + '.';
  }

  fields.forEach(function (field) {
    field.addEventListener('input', update);
  });

  var copyBtn = document.getElementById('copy-btn');
  var copyBtnOriginal = copyBtn.innerHTML;

  function showCopied() {
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied';
    setTimeout(function () {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = copyBtnOriginal;
    }, 1500);
  }

  function fallbackCopy(text) {
    var temp = document.createElement('textarea');
    temp.value = text;
    temp.style.position = 'fixed';
    temp.style.opacity = '0';
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    try { document.execCommand('copy'); } catch (e) { /* clipboard unavailable */ }
    document.body.removeChild(temp);
  }

  copyBtn.addEventListener('click', function () {
    var text = preview.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(showCopied, function () {
        fallbackCopy(text);
        showCopied();
      });
    } else {
      fallbackCopy(text);
      showCopied();
    }
  });
});

// Single-select move chips for each refinement round.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.mcq-group').forEach(function (group) {
    var options = group.querySelectorAll('.mcq-option');
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('selected'); });
        option.classList.add('selected');
      });
    });
  });
});

// Download my answers: compile the whole task into one plain-text file
// the learner can keep as evidence, since nothing here is saved.
document.addEventListener('DOMContentLoaded', function () {
  var downloadBtn = document.getElementById('download-btn');
  if (!downloadBtn) return;

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function selectedMove(groupIndex) {
    var groups = document.querySelectorAll('.mcq-group');
    var group = groups[groupIndex];
    if (!group) return '(not answered)';
    var selected = group.querySelector('.mcq-option.selected');
    return selected ? selected.textContent.trim() : '(not answered)';
  }

  downloadBtn.addEventListener('click', function () {
    var lines = [
      'Your Own Task, Framed and Refined — my answers',
      '',
      'My task: ' + (val('task-name') || '(not answered)'),
      '',
      'Framed request: ' + document.getElementById('prompt-preview').textContent,
      "AI's first answer: " + (val('out-first') || '(not answered)'),
      '',
      'Round 1',
      'Move used: ' + selectedMove(0),
      'What I asked: ' + (val('r1-ask') || '(not answered)'),
      'New output: ' + (val('r1-out') || '(not answered)'),
      '',
      'Round 2',
      'Move used: ' + selectedMove(1),
      'What I asked: ' + (val('r2-ask') || '(not answered)'),
      'New output: ' + (val('r2-out') || '(not answered)'),
      '',
      'Where I stopped, and why: ' + (val('stop-point') || '(not answered)'),
      '',
      'What the AI helped with: ' + (val('ai-part') || '(not answered)'),
      'What I did myself: ' + (val('my-part') || '(not answered)')
    ];

    var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'your-own-task-framed-and-refined-answers.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});
