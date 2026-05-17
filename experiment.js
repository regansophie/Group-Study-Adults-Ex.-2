const MANIFEST_PATHS = [
  "jspsych_stimuli/manifest.json",
  "../jspsych_stimuli/manifest.json",
];
const DATAPIPE_EXPERIMENT_ID = "aZEUjZ2GD7ys";
const PROLIFIC_COMPLETION_CODE = "CNENXNHJ";
const EXPOSURE_CHOICES = ["Next"];
const TEST_CHOICES = ["Blue group", "Red group"];
const CONSENT_IMAGES = [
  "consent form/consentFormPt1.jpg",
  "consent form/consentFormPt2.jpg",
  "consent form/consentFormPt3.jpg",
  "consent form/consentFormPt4.jpg",
  "consent form/consentFormPt5.jpg",
];
const COUNTERBALANCE = {
  1: {
    basic_level_group: "Red group",
    subordinate_level_group: "Blue group",
    exposure_first_group: "Red group",
    exposure_first_label_level: "basic",
    test_first_group: "Red group",
    test_first_label_level: "basic",
  },
  2: {
    basic_level_group: "Red group",
    subordinate_level_group: "Blue group",
    exposure_first_group: "Blue group",
    exposure_first_label_level: "subordinate",
    test_first_group: "Blue group",
    test_first_label_level: "subordinate",
  },
  3: {
    basic_level_group: "Red group",
    subordinate_level_group: "Blue group",
    exposure_first_group: "Red group",
    exposure_first_label_level: "basic",
    test_first_group: "Blue group",
    test_first_label_level: "subordinate",
  },
  4: {
    basic_level_group: "Red group",
    subordinate_level_group: "Blue group",
    exposure_first_group: "Blue group",
    exposure_first_label_level: "subordinate",
    test_first_group: "Red group",
    test_first_label_level: "basic",
  },
  5: {
    basic_level_group: "Blue group",
    subordinate_level_group: "Red group",
    exposure_first_group: "Blue group",
    exposure_first_label_level: "basic",
    test_first_group: "Blue group",
    test_first_label_level: "basic",
  },
  6: {
    basic_level_group: "Blue group",
    subordinate_level_group: "Red group",
    exposure_first_group: "Red group",
    exposure_first_label_level: "subordinate",
    test_first_group: "Red group",
    test_first_label_level: "subordinate",
  },
  7: {
    basic_level_group: "Blue group",
    subordinate_level_group: "Red group",
    exposure_first_group: "Blue group",
    exposure_first_label_level: "basic",
    test_first_group: "Red group",
    test_first_label_level: "subordinate",
  },
  8: {
    basic_level_group: "Blue group",
    subordinate_level_group: "Red group",
    exposure_first_group: "Red group",
    exposure_first_label_level: "subordinate",
    test_first_group: "Blue group",
    test_first_label_level: "basic",
  },
};

function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizeVersion(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 8 ? parsed : null;
}

function makeParticipantId() {
  const prolificPid = getUrlParam("PROLIFIC_PID");
  const participant = getUrlParam("participant") || getUrlParam("participant_id") || getUrlParam("id");
  return prolificPid || participant || `anon_${Date.now()}_${randomInteger(1000, 9999)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function makeProlificIdTrial(jsPsych, initialParticipantId) {
  const prefill = initialParticipantId.startsWith("anon_") ? "" : initialParticipantId;
  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
      <div class="id-entry">
        <h1>Participant ID</h1>
        <p>Please enter your Prolific ID before beginning the study.</p>
      </div>
    `,
    html: `
      <div class="id-entry">
        <label for="prolific-id">Prolific ID</label>
        <input id="prolific-id" name="prolific_id" type="text" value="${escapeHtml(prefill)}" required />
      </div>
    `,
    autofocus: "prolific-id",
    button_label: "Continue",
    data: {
      phase: "prolific_id_entry",
    },
    on_finish: (data) => {
      const enteredId = String(data.response.prolific_id || "").trim();
      data.entered_prolific_id = enteredId;
      data.participant_id = enteredId;
      jsPsych.data.addProperties({
        participant_id: enteredId,
        prolific_pid: enteredId,
      });
    },
  };
}

function labelLevelForText(text) {
  const match = text.match(/Look!\s+It.?s\s+(?:an?\s+)?([^.”".]+)[.”".]/i);
  if (!match) {
    return null;
  }

  const label = match[1].trim().toLowerCase();
  return ["dog", "bug"].includes(label) ? "basic" : "subordinate";
}

function groupForText(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("blue group")) {
    return "Blue group";
  }
  if (lowerText.includes("red group")) {
    return "Red group";
  }
  return null;
}

function labelLevelForGroup(group, counterbalance) {
  if (group === counterbalance.basic_level_group) {
    return "basic";
  }
  if (group === counterbalance.subordinate_level_group) {
    return "subordinate";
  }
  return null;
}

function imagePathFromManifest(path, manifestPath) {
  const relativePath = path
    .replace(/^Experiment 2\/jspsych_stimuli\//, "")
    .replace(/^jspsych_stimuli\//, "");
  const manifestBase = manifestPath.replace(/manifest\.json$/, "");
  return `${manifestBase}${relativePath}`;
}

function makeSlideStimulus(imagePath) {
  return `<div class="stage"><img class="slide-image" src="${imagePath}" alt="" /></div>`;
}

function makeConsentStimulus(imagePath, prompt = "") {
  return `
    <div class="stage">
      <img class="consent-image" src="${imagePath}" alt="Consent form page" />
      ${prompt}
    </div>
  `;
}

function makeCompletionScreen() {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="stage">
        <h1>Thank you.</h1>
        <p>Your responses have been saved.</p>
        <p>Your Prolific completion code is:</p>
        <h2>${PROLIFIC_COMPLETION_CODE}</h2>
      </div>
    `,
    choices: [],
    trial_duration: null,
  };
}

async function loadManifest() {
  for (const path of MANIFEST_PATHS) {
    const response = await fetch(path);
    if (response.ok) {
      return {
        manifest: await response.json(),
        manifestPath: path,
      };
    }
  }

  throw new Error(`Could not load a stimulus manifest. Tried: ${MANIFEST_PATHS.join(", ")}`);
}

function buildTimeline(jsPsych, manifest, manifestPath, assignedVersion, participantId) {
  const version = manifest.versions.find((entry) => entry.version === assignedVersion);
  if (!version) {
    throw new Error(`Missing counterbalance version ${assignedVersion}`);
  }
  const counterbalance = COUNTERBALANCE[assignedVersion];

  const allImages = CONSENT_IMAGES.concat(
    version.exposure.concat(version.test).map((slide) => imagePathFromManifest(slide.image, manifestPath))
  );
  const filename = `experiment2_${participantId}_v${String(assignedVersion).padStart(2, "0")}_${Date.now()}_${randomInteger(1000, 9999)}.csv`;
  const timeline = [];

  jsPsych.data.addProperties({
    experiment: "experiment_2_adult_online",
    participant_id: participantId,
    counterbalance_version: assignedVersion,
    datapipe_experiment_id: DATAPIPE_EXPERIMENT_ID,
    source_pptx: version.source_pptx,
    basic_level_group: counterbalance.basic_level_group,
    subordinate_level_group: counterbalance.subordinate_level_group,
    exposure_first_group: counterbalance.exposure_first_group,
    exposure_first_label_level: counterbalance.exposure_first_label_level,
    test_first_group: counterbalance.test_first_group,
    test_first_label_level: counterbalance.test_first_label_level,
    prolific_pid: getUrlParam("PROLIFIC_PID"),
    study_id: getUrlParam("STUDY_ID"),
    session_id: getUrlParam("SESSION_ID"),
  });

  timeline.push({
    type: jsPsychPreload,
    images: allImages,
    message: "Loading the experiment...",
    show_progress_bar: true,
    show_detailed_errors: true,
  });

  timeline.push(makeProlificIdTrial(jsPsych, participantId));

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="stage">
        <h1>Welcome</h1>
        <p>Next, you will see a consent form. Please read the information provided and decide whether or not you consent to participating in the study.</p>
      </div>
    `,
    choices: ["Continue"],
    data: {
      phase: "instructions",
      counterbalance_version: assignedVersion,
    },
  });

  CONSENT_IMAGES.slice(0, 4).forEach((image, index) => {
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: makeConsentStimulus(image),
      choices: ["Next"],
      data: {
        phase: "consent",
        consent_page: index + 1,
        image,
        counterbalance_version: assignedVersion,
      },
    });
  });

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: makeConsentStimulus(CONSENT_IMAGES[4], "<p>Do you consent to participating in this experiment?</p>"),
    choices: ["I consent", "I do not consent"],
    data: {
      phase: "consent",
      consent_page: 5,
      image: CONSENT_IMAGES[4],
      counterbalance_version: assignedVersion,
    },
    on_finish: (data) => {
      data.consent_response = data.response === 0 ? "I consent" : "I do not consent";
      data.consented = data.response === 0;
      if (!data.consented) {
        jsPsych.endExperiment("You did not consent to participate. The experiment is now complete.");
      }
    },
  });

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="stage">
        <h1>Thank you.</h1>
        <p>You will now see a series of slides. Please read each slide carefully.</p>
      </div>
    `,
    choices: ["Start"],
    data: {
      phase: "post_consent_instructions",
      counterbalance_version: assignedVersion,
    },
  });

  version.exposure.forEach((slide, index) => {
    const image = imagePathFromManifest(slide.image, manifestPath);
    const slideGroup = groupForText(slide.text);
    const slideLabelLevel = labelLevelForText(slide.text);
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: makeSlideStimulus(image),
      choices: EXPOSURE_CHOICES,
      data: {
        phase: "exposure",
        exposure_trial_number: index + 1,
        slide_number: slide.slide_number,
        image,
        slide_text: slide.text,
        slide_group: slideGroup,
        slide_label_level: slideLabelLevel,
        slide_group_label_level: labelLevelForGroup(slideGroup, counterbalance),
        counterbalance_version: assignedVersion,
      },
    });
  });

  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="stage">
        <h1>Almost done</h1>
        <p>Now you will answer a few questions. Choose the group you think is the best answer.</p>
      </div>
    `,
    choices: ["Continue"],
    data: {
      phase: "test_instructions",
      counterbalance_version: assignedVersion,
    },
  });

  version.test.forEach((slide, index) => {
    const image = imagePathFromManifest(slide.image, manifestPath);
    const slideLabelLevel = labelLevelForText(slide.text);
    timeline.push({
      type: jsPsychImageButtonResponse,
      stimulus: image,
      stimulus_width: 960,
      maintain_aspect_ratio: true,
      choices: TEST_CHOICES,
      button_html: [
        '<button class="jspsych-btn choice-blue">%choice%</button>',
        '<button class="jspsych-btn choice-red">%choice%</button>',
      ],
      render_on_canvas: false,
      data: {
        phase: "test",
        test_trial_number: index + 1,
        slide_number: slide.slide_number,
        image,
        slide_text: slide.text,
        slide_label_level: slideLabelLevel,
        choices: TEST_CHOICES,
        counterbalance_version: assignedVersion,
      },
      on_finish: (data) => {
        data.selected_group = TEST_CHOICES[data.response];
        data.selected_label_level = labelLevelForGroup(data.selected_group, counterbalance);
        data.selected_basic_level_group = data.selected_label_level === "basic";
        data.selected_subordinate_level_group = data.selected_label_level === "subordinate";
      },
    });
  });

  timeline.push({
    type: jsPsychPipe,
    action: "save",
    experiment_id: DATAPIPE_EXPERIMENT_ID,
    filename,
    data_string: () => jsPsych.data.get().csv(),
  });

  timeline.push(makeCompletionScreen());

  return timeline;
}

function showError(error) {
  document.body.innerHTML = `
    <div class="error-message">
      <h1>Experiment could not start</h1>
      <p>${error.message}</p>
      <p>If you opened this file directly, try running it from a local web server so the manifest can load.</p>
    </div>
  `;
}

async function startExperiment() {
  try {
    const { manifest, manifestPath } = await loadManifest();
    const requestedVersion = normalizeVersion(getUrlParam("version"));
    const assignedVersion = requestedVersion || randomInteger(1, 8);
    const participantId = makeParticipantId();

    const jsPsych = initJsPsych({
      show_progress_bar: true,
      auto_update_progress_bar: true,
      on_finish: () => {},
    });

    const timeline = buildTimeline(jsPsych, manifest, manifestPath, assignedVersion, participantId);
    jsPsych.run(timeline);
  } catch (error) {
    showError(error);
  }
}

startExperiment();
