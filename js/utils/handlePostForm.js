function updateForm(form, field, data) {
  const f = form.querySelector(`name[${field}]`);
  f.value = data[field];
}

export function handlePostForm({ formId, defaultData, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  ['title', 'author', 'description'].forEach((field) => {
    updateForm(form, field, defaultData);
  });
}
